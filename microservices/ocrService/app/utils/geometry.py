# utils/geometry.py
import numpy as np
import cv2


def order_points(pts: np.ndarray) -> np.ndarray:
    """
    Ordena 4 puntos arbitrarios de la forma:
    [top‑left, top‑right, bottom‑right, bottom‑left]

    Parameters
    ----------
    pts : np.ndarray   # shape (4,2)

    Returns
    -------
    np.ndarray        # shape (4,2) ordenado
    """
    rect = np.zeros((4, 2), dtype="float32")

    # la esquina superior‑izq. tendrá la mínima suma (x+y)
    # la esquina inferior‑der. la máxima suma
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    # la superior‑der. tiene la menor diferencia (x‑y),
    # la inferior‑izq. la mayor diferencia
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    return rect


def four_point_transform(image: np.ndarray,
                         pts: np.ndarray) -> np.ndarray:
    """
    Recorta y construye una vista “cenital” del rectángulo
    definido por 4 puntos.

    Parameters
    ----------
    image : np.ndarray
        Imagen de origen (BGR o gray).
    pts : np.ndarray
        Matriz (4,2) de coordenadas (x,y).

    Returns
    -------
    np.ndarray
        Imagen con perspectiva corregida.
    """
    # 1) ordenar puntos
    rect = order_points(pts.astype("float32"))
    (tl, tr, br, bl) = rect

    # 2) dimensiones del nuevo lienzo
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxW = int(max(widthA, widthB))

    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxH = int(max(heightA, heightB))

    # 3) destino perfecto (0,0)  (maxW-1,maxH-1)
    dst = np.array([
        [0,      0],
        [maxW-1, 0],
        [maxW-1, maxH-1],
        [0,      maxH-1]
    ], dtype="float32")

    # 4) calcular matriz de perspectiva y warpear
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxW, maxH),
                                 flags=cv2.INTER_CUBIC)

    return warped
