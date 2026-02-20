from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # This allows React to talk to Flask

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True)