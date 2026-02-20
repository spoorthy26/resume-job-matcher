import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState("");

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.text_preview) {
      setResumeText(data.text_preview);
      alert("Resume uploaded successfully");
    } else {
      alert("Error uploading resume");
    }
  };

  const matchResume = async () => {
    const res = await fetch("http://127.0.0.1:5000/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDesc,
      }),
    });

    const data = await res.json();
    setScore(data.match_score);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Resume Job Matcher</h1>

      <h3>Upload Resume</h3>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />
      <button onClick={uploadResume}>Upload Resume</button>

      <h3>Paste Job Description</h3>
      <textarea
        rows="6"
        cols="60"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <br /><br />
      <button onClick={matchResume}>Check Match Score</button>

      {score && (
        <h2>Match Score: {score}%</h2>
      )}
    </div>
  );
}

export default App;