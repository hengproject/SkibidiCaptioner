from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)

CORS(app)
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong!"})

@app.route("/echo", methods=["POST"])
def echo():
    data = request.json
    return jsonify({"you_sent": data})

if __name__ == "__main__":
    app.run(port=5000)
