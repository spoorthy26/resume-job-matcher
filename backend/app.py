from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # This allows React to talk to Flask

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/upload", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Extract text from PDF
    text = ""
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted

        if not text.strip():
            return jsonify({
                "error": "Unable to extract text. Please upload a text-based PDF."
            }), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "message": "Resume uploaded successfully",
        "full_text": text,
        "text_preview": text[:500]
    })

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

@app.route("/match", methods=["POST"])
def match():
    data = request.get_json()
    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")

    print("Resume length:", len(resume_text))
    print("JD length:", len(job_description))

    documents = [resume_text, job_description]

    resume_text = resume_text[:2000]
    job_description = job_description[:1000]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(documents)

    feature_names = vectorizer.get_feature_names_out()
    print("Total common vocabulary size:", len(feature_names))

    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    score = round(similarity * 100, 2)

# Normalize score for better interpretation
    if score < 30:
        score = score
    elif score < 50:
        score = score + 20
    else:
        score = score + 30

    score = min(score, 100)

    print("Resume sample:")
    print(resume_text[:500])

    print("\nJD sample:")
    print(job_description[:200])

    print("Similarity score:", score)

    return jsonify({"match_score": score})

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True)