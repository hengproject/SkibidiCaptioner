from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from moviepy import VideoFileClip
import os
import mimetypes

app = Flask(__name__)
CORS(app)  # 开启跨域

UPLOAD_FOLDER = 'uploads'
AUDIO_FOLDER = 'audios'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    print(111)
    if 'file' not in request.files:
        return jsonify({'error': '没有找到文件'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '文件名为空'}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    # 判断是否为视频
    mime_type, _ = mimetypes.guess_type(save_path)
    if mime_type and mime_type.startswith('video'):
        audio_filename = filename.rsplit('.', 1)[0] + '.mp3'
        audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
        try:
            video = VideoFileClip(save_path)
            video.audio.write_audiofile(audio_path)
            return jsonify({'audio': f'/api/audio/{audio_filename}'})
        except Exception as e:
            return jsonify({'error': f'音频提取失败: {str(e)}'}), 500

    # 如果是音频则直接返回路径
    return jsonify({'audio': f'/api/uploaded/{filename}'})

@app.route('/ping')
def ping():
    return 'ding'
@app.route('/api/uploaded/<path:filename>')
def serve_uploaded(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
