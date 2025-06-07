# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

# Instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código
COPY . .

# Puerto expuesto
EXPOSE 5020

# Comando para lanzar Flask
CMD ["python", "app/main.py"]
