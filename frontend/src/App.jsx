import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState(null);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    
    

    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);

    if (data.full_text) {
      setResumeText(data.full_text);
      console.log("Resume text length:", data.full_text.length);
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

  const getMatchLabel = (score) => {
      if (score >= 80) return "Excellent Match";
      if (score >= 60) return "Good Match";
      if (score >= 40) return "Average Match";
      return "Low Match";
    };

  return (
    
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Resume–Job Matcher</h1>
          <p style={styles.subtitle}>
            Upload your resume and compare it with a job description
          </p>
        </div>
        
    

        <div style={styles.mainContainer}>
          {/* Upload Section */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Upload Resume</h3>

            <div style={styles.centeredContent}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />

              <button onClick={uploadResume} style={styles.primaryButton}>
                Upload
              </button>
            </div>
          </div>

          {/* Job Description Section */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Job Description</h3>

            <div style={styles.centeredContent}>
              <textarea
                rows="8"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                style={styles.textarea}
                placeholder="Paste the job description here..."
              />

              <button onClick={matchResume} style={styles.secondaryButton}>
                Calculate Match
              </button>
            </div>
          </div>
        </div>

        {score !== null && (
  <div style={styles.resultBox}>
    <h3 style={{ marginBottom: "10px" }}>Match Result</h3>

    <div style={styles.progressBarBackground}>
      <div
        style={{
          ...styles.progressBarFill,
          width: `${score}%`,
        }}
      />
    </div>

    <p style={{ marginTop: "10px", fontSize: "18px" }}>
      {score}% – {getMatchLabel(score)}
    </p>
  </div>
)}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f9fafb", // subtle soft white
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },

  wrapper: {
    width: "100%",
    maxWidth: "1100px",
    padding: "50px 40px",
  },
  progressBarBackground: {
  width: "100%",
  height: "14px",
  backgroundColor: "#e5e7eb",
  borderRadius: "8px",
  overflow: "hidden",
},

progressBarFill: {
  height: "100%",
  backgroundColor: "#2563eb",
  borderRadius: "8px",
  transition: "width 0.5s ease",
},

  header: {
    marginBottom: "40px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  mainContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
  },

  cardTitle: {
    marginBottom: "20px",
    color: "#1f2937",
    fontWeight: "600",
  },

  centeredContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    width: "100%",
  },

  fileInput: {
    width: "100%",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    resize: "vertical",
    fontFamily: "inherit",
  },

  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },

  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },

  resultBox: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    fontSize: "20px",
    color: "#111827",
  },

  score: {
    color: "#2563eb",
    fontWeight: "600",
  },
};

export default App;