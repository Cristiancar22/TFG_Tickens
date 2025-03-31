FROM python:3.10-slim

# Instala dependencias necesarias del sistema
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    gcc \
    && apt-get clean

# Copia el código
WORKDIR /app
COPY . .

# Instala dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto
EXPOSE 5000

# Comando de inicio
CMD ["python", "app/main.py"]
