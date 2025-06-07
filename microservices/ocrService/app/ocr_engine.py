"""Core OCR logic (pre‑process, OCR, post‑process)."""
import cv2, numpy as np, pytesseract, pathlib, json, re, textdistance, os
from PIL import Image
from utils.deskew import deskew
from utils.lexicon import fuzzy_correct
from utils.totals import check_total
from utils.geometry import four_point_transform
import datetime

ROOT = pathlib.Path(__file__).resolve().parent
TESSDATA_DIR = ROOT / 'data' / 'tessdata'
PATTERNS_FILE = TESSDATA_DIR / 'ticket_patterns.txt'

TESS_CONFIG = (
    '--oem 1 '
    '--psm 4 '  # mejor para texto alineado vertical
    '-l spa '
    '-c preserve_interword_spaces=1 '
    '-c textord_heavy_nr=1 '
    f'-c user_patterns_file={PATTERNS_FILE} '
    '-c tessedit_char_whitelist= ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    'abcdefghijklmnopqrstuvwxyz0123456789€.,:-/%kgKG'
)

def try_find_document(bgr):
    """Devuelve imagen ‘deskew’ o None si no encuentra un contorno de 4 puntos."""
    ratio = bgr.shape[0] / 500.0
    small = cv2.resize(bgr, (int(bgr.shape[1]/ratio), 500))
    gray  = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 75, 200)

    cnts, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:
            return four_point_transform(bgr, approx.reshape(4, 2) * ratio)
    return None

def preprocess(bgr: np.ndarray, save_debug: bool=False, prefix: str = None) -> np.ndarray:
    if save_debug:
        dbg_dir = ROOT / 'debug'
        dbg_dir.mkdir(exist_ok=True)
        ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        prefix = prefix or ts
        cv2.imwrite(str(dbg_dir / f'{prefix}_0_original.jpg'), bgr)

    # ---------- 1. asegurar resolución mínima ----------
    if bgr.shape[0] < 1200:
        scale = 1200 / bgr.shape[0]
        bgr = cv2.resize(bgr, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

    if save_debug:
        cv2.imwrite(str(dbg_dir / f'{prefix}_1_resized.jpg'), bgr)

    # ---------- 2. intentar enderezar ----------
    deskewed = try_find_document(bgr)
    if deskewed is not None:
        bgr = deskewed
        if save_debug:
            cv2.imwrite(str(dbg_dir / f'{prefix}_2_deskewed.jpg'), bgr)

    # ---------- 3. normalización de iluminación ----------
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    den  = cv2.fastNlMeansDenoising(gray, h=10, templateWindowSize=7, searchWindowSize=21)
    blur = cv2.GaussianBlur(den, (41, 41), 0)
    norm = cv2.divide(den, blur, scale=255)

    if save_debug:
        cv2.imwrite(str(dbg_dir / f'{prefix}_3_normalized.jpg'), norm)

    # ---------- 4. binarización adaptativa ----------
    binar = cv2.adaptiveThreshold(
        norm, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 10
    )

    if save_debug:
        cv2.imwrite(str(dbg_dir / f'{prefix}_4_binarized.jpg'), binar)

    # ---------- 5. limpieza de ruido ----------
    kernel = np.ones((2, 2), np.uint8)
    clean = cv2.morphologyEx(binar, cv2.MORPH_OPEN, kernel, 1)

    if save_debug:
        cv2.imwrite(str(dbg_dir / f'{prefix}_5_cleaned.jpg'), clean)

    return clean

def ocr_keep_spaces(img_bin: np.ndarray) -> str:
    """OCR conservando los huecos entre palabras."""
    data = pytesseract.image_to_data(
        img_bin, lang="spa", config=TESS_CONFIG,
        output_type=pytesseract.Output.DICT
    )
    txt, last_ln, last_right = [], -1, 0
    for i in range(len(data["text"])):
        if int(data["conf"][i]) < 0 or not data["text"][i].strip():
            continue
        ln = data["line_num"][i]
        if ln != last_ln:                     # salto de línea
            txt.append("\n")
            last_ln, last_right = ln, 0
        gap = data["left"][i] - last_right    # px entre palabras
        spaces = max(1, gap // 15)            # 15 px ≈ 1 espacio
        txt.append(" " * spaces + data["text"][i])
        last_right = data["left"][i] + data["width"][i]
    return "".join(txt).lstrip()

def fix_numbers(token: str) -> str:
    token = re.sub(r'€[34]\b', '€', token)
    token = re.sub(r'(\d),(\d)\s*€', r'\1,\g<2>0 €', token)
    token = re.sub(r'K0(?:G)?', 'KG', token, flags=re.I)
    return token

def clean_ocr(raw: str) -> str:
    lines = []
    for raw_line in raw.splitlines():
        raw_line = fix_numbers(raw_line)
        words = [fuzzy_correct(w) for w in raw_line.split()]
        lines.append(" ".join(words))
    return "\n".join(lines)

def process_image(pil_img: Image.Image, save_debug: bool=False):
    bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    processed = preprocess(bgr, save_debug=save_debug, prefix=ts)

    pil_bin = Image.fromarray(processed)

    raw_text = ocr_keep_spaces(processed)
    text = clean_ocr(raw_text)
    total_ok = check_total(text)

    return text, total_ok
