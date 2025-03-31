from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import os

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    image = Image.open(image_file.stream)

    try:
        text = pytesseract.image_to_string(image)
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
