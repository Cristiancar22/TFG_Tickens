
from flask import Flask, request, jsonify
from PIL import Image, ImageOps
import io
import ocr_engine as ocr_engine

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    pil_img = Image.open(image_file.stream)
    pil_img = ImageOps.exif_transpose(pil_img).convert('RGB')

    text, total_ok = ocr_engine.process_image(pil_img,
                                              save_debug=app.debug)

    return jsonify({'text': text, 'total_consistent': total_ok}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010, debug=True)
