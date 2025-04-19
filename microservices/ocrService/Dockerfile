FROM python:3.10-slim

# Instala dependencias necesarias del sistema y Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    wget \
    gcc \
    && apt-get clean

# Asegura que exista el directorio de tessdata
RUN mkdir -p /usr/share/tesseract-ocr/5/tessdata

# Descarga el idioma español (spa) de tessdata_best
RUN wget -O /usr/share/tesseract-ocr/5/tessdata/spa.traineddata \
    https://github.com/tesseract-ocr/tessdata_best/raw/main/spa.traineddata

# Copia el código de la app
WORKDIR /app
COPY . .

# Instala dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto
EXPOSE 5000

# Comando de inicio
CMD ["python", "app/main.py"]
