
import re

def check_total(text: str, tolerance: float=0.02) -> bool:
    nums = [float(x.replace(',', '.'))
            for x in re.findall(r'(\d+[.,]\d{2})\s*€', text)]
    guess = round(sum(nums), 2)
    m = re.search(r'TOTAL[^\d]*(\d+[.,]\d{2})', text, re.I)
    if not m:
        return False
    ticket = float(m.group(1).replace(',', '.'))
    return abs(ticket - guess) <= tolerance
