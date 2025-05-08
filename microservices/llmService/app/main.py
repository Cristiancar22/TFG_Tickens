import json
import os
import re
from datetime import datetime
from typing import List, Optional

from flask import Flask, jsonify, request
from pydantic import BaseModel, Field, ValidationError
import openai
import backoff

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
openai.api_key = os.getenv("OPENAI_API_KEY", "")
MODEL = "gpt-4o-mini-2024-07-18"

# ---------------------------------------------------------------------------
# Data schema
# ---------------------------------------------------------------------------
class Item(BaseModel):
    cantidad: Optional[float] = Field(None)
    descripcion: str
    precio_unitario: Optional[float] = None
    importe: Optional[float] = None
    peso_kg: Optional[float] = None

class Ticket(BaseModel):
    supermercado: Optional[str] = None
    fecha: Optional[str] = None
    direccion: Optional[str] = None
    items: List[Item]
    total_ticket: Optional[float] = None

# ---------------------------------------------------------------------------
# Prompt sent to LLM
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """
Eres un asistente que extrae información estructurada de tickets de compra escritos en español.
Devuelve exclusivamente un JSON que cumpla exactamente con este esquema:
{
  "supermercado": string|null,
  "fecha": string|null,             # Formato obligatorio: dd/mm/yyyy (ej. 29/04/2025)
  "direccion": string|null,
  "items": [
      {"cantidad": number|null,
       "descripcion": string,
       "precio_unitario": number|null,
       "importe": number|null,
       "peso_kg": number|null}
  ],
  "total_ticket": number|null
}
Restricciones:
- El campo "fecha" debe estar en formato dd/mm/yyyy y cumplir el patrón: /^\d{2}\/\d{2}\/\d{4}$/.
- No incluyas ningún otro texto ni comentarios.
- Corrige errores de OCR y usa punto como separador decimal.
"""

# ---------------------------------------------------------------------------
# Date normalization
# ---------------------------------------------------------------------------
def normalize_date_format(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None

    # Intenta primero validar si ya cumple el formato correcto
    if re.match(r"^\d{2}/\d{2}/\d{4}$", date_str):
        return date_str

    # Intenta parsear con otros formatos comunes
    possible_formats = ["%d-%m-%Y", "%d.%m.%Y", "%Y-%m-%d", "%Y/%m/%d", "%Y-%m-%dT%H:%M:%S"]
    for fmt in possible_formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%d/%m/%Y")
        except ValueError:
            continue

    # Si no se puede arreglar, devuelve None
    return None

# ---------------------------------------------------------------------------
# LLM call
# ---------------------------------------------------------------------------
@backoff.on_exception(backoff.expo, openai.RateLimitError, max_time=60)
def ask_llm(raw_text: str) -> dict:
    response = openai.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": raw_text},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)

def parse_ticket(raw_text: str) -> Ticket:
    data = ask_llm(raw_text)
    # Normalizar la fecha aquí
    data["fecha"] = normalize_date_format(data.get("fecha"))
    return Ticket.model_validate(data)

# ---------------------------------------------------------------------------
# Flask app
# ---------------------------------------------------------------------------
app = Flask(__name__)

@app.route("/parse", methods=["POST"])
def parse_endpoint():
    body = request.get_json(silent=True) or {}
    raw_text = body.get("text", "")
    if not raw_text:
        return jsonify(error="Field 'text' is required"), 400
    try:
        ticket = parse_ticket(raw_text)
    except ValidationError as e:
        return jsonify(error="Validation error", detail=e.errors()), 422
    except openai.OpenAIError as e:
        return jsonify(error="OpenAI API error", detail=str(e)), 502
    return jsonify(ticket.model_dump())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5020)
