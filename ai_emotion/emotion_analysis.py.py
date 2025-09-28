from flask import Flask, request, jsonify
from flask_cors import CORS
from fer import FER
import cv2, numpy as np, base64

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

detector = FER(mtcnn=True)

emoji_map = {
    "happy": "😄",
    "sad": "😢",
    "angry": "😠",
    "surprise": "😲",
    "fear": "😨",
    "disgust": "🤢",
    "neutral": "😐"
}

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
  
        return '', 200

    try:
        data = request.json
        img_input = data.get('image')
        print("Received image input")

        if not img_input:
            return jsonify({"error": "No image provided"}), 400

        if img_input.startswith('data:image'):
            img_bytes = base64.b64decode(img_input.split(',')[1])
        else:
            return jsonify({"error": "Invalid image format"}), 400

        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Failed to decode image"}), 400

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = detector.detect_emotions(img_rgb)
        print("FER raw results:", results)

        if results:
            emotions = results[0]['emotions']
       
            for emotion, score in emotions.items():
                print(f"{emotion}: {score:.4f}")

            top_emotion = max(emotions, key=emotions.get)
            emoji = emoji_map.get(top_emotion, "🤔")
            print("Detected top emotion:", top_emotion)
            print("Detected emoji:", emoji)

            return jsonify({"emoji": emoji, "scores": emotions})
        else:
            print("No face detected, returning neutral")
            return jsonify({"emoji": "😐"})

    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
