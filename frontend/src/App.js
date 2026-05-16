import { useState} from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/resume";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #07080f;
    --surface: #0e1018;
    --border: #1c1f2e;
    --accent: #7c6bff;
    --accent2: #00e5c0;
    --danger: #ff5e7d;
    --success: #00e5c0;
    --text: #eef0ff;
    --muted: #5a5f7a;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fillBar {
    from { width: 0%; }
    to { width: var(--target); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.2s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.3s ease both; }

  .app { min-height: 100vh; padding: 40px 20px; }
  .wrap { max-width: 760px; margin: 0 auto; }

  .hero { text-align: center; margin-bottom: 48px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(124,107,255,0.12); border: 1px solid rgba(124,107,255,0.3);
    color: #a89fff; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 6px 14px; border-radius: 999px;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 6vw, 3.8rem);
    font-weight: 800; line-height: 1.1; margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #a89fff 50%, #00e5c0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p { color: var(--muted); font-size: 1rem; font-weight: 300; }

  .steps-bar { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 36px; }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .step-dot {
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 0.8rem; font-weight: 700; font-family: 'Syne', sans-serif;
    border: 2px solid var(--border); color: var(--muted); background: var(--surface);
    transition: all 0.3s;
  }
  .step-dot.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .step-dot.done { background: var(--accent2); border-color: var(--accent2); color: #000; }
  .step-label { font-size: 0.7rem; color: var(--muted); font-weight: 500; }
  .step-line { width: 60px; height: 1px; background: var(--border); margin-bottom: 20px; }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; margin-bottom: 16px;
  }
  .card-glow { box-shadow: 0 0 60px rgba(124,107,255,0.08); }

  label { display: block; color: var(--muted); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 10px; }

  .file-zone {
    border: 1.5px dashed var(--border); border-radius: 14px; padding: 28px;
    text-align: center; cursor: pointer; transition: all 0.2s; position: relative;
    background: rgba(124,107,255,0.03);
  }
  .file-zone:hover { border-color: var(--accent); background: rgba(124,107,255,0.06); }
  .file-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
  .file-icon { font-size: 2rem; margin-bottom: 8px; }
  .file-text { color: var(--muted); font-size: 0.85rem; }
  .file-selected { color: var(--accent2); font-size: 0.85rem; font-weight: 500; margin-top: 8px; }

  textarea {
    width: 100%; background: rgba(255,255,255,0.03); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 16px; color: var(--text); font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif; resize: none; outline: none; transition: border 0.2s;
    line-height: 1.6;
  }
  textarea:focus { border-color: var(--accent); }

  .btn {
    width: 100%; padding: 16px; border-radius: 14px; border: none;
    font-size: 0.95rem; font-weight: 700; font-family: 'Syne', sans-serif;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
  }
  .btn-primary {
    background: linear-gradient(135deg, #7c6bff, #5b4bdb);
    color: #fff; box-shadow: 0 8px 32px rgba(124,107,255,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124,107,255,0.4); }
  .btn-primary:disabled { opacity: 0.6; transform: none; cursor: not-allowed; }
  .btn-teal { background: linear-gradient(135deg, #00e5c0, #00b89a); color: #000; box-shadow: 0 8px 32px rgba(0,229,192,0.2); }
  .btn-teal:hover { transform: translateY(-2px); }
  .btn-teal:disabled { opacity: 0.6; transform: none; cursor: not-allowed; }
  .btn-ghost { background: var(--border); color: var(--muted); }
  .btn-ghost:hover { color: var(--text); background: #252836; }

  .error-msg { color: var(--danger); font-size: 0.82rem; margin-top: 10px; }

  .score-hero { text-align: center; padding: 12px 0 24px; }
  .score-label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
  .score-num {
    font-family: 'Syne', sans-serif; font-size: 7rem; font-weight: 800; line-height: 1;
    animation: countUp 0.6s ease both;
  }
  .score-grade { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; margin-top: 8px; }
  .score-verdict { color: var(--muted); font-size: 0.88rem; margin-top: 6px; }
  .score-summary { color: #3a3f56; font-size: 0.78rem; margin-top: 10px; }

  .progress-track { background: var(--border); border-radius: 999px; height: 6px; margin-top: 24px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px; animation: fillBar 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }

  .section-title { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }

  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { padding: 6px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 500; }
  .tag-green { background: rgba(0,229,192,0.1); color: var(--accent2); border: 1px solid rgba(0,229,192,0.2); }
  .tag-red { background: rgba(255,94,125,0.1); color: var(--danger); border: 1px solid rgba(255,94,125,0.2); }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .q-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 14px; padding: 18px; margin-bottom: 10px; }
  .q-num { font-size: 0.7rem; color: var(--muted); margin-bottom: 6px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .q-text { color: var(--text); font-size: 0.9rem; line-height: 1.65; }
  .q-tags { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
  .tag-blue { background: rgba(124,107,255,0.1); color: #a89fff; border: 1px solid rgba(124,107,255,0.2); }
  .tag-yellow { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .tag-pink { background: rgba(244,114,182,0.1); color: #f472b6; border: 1px solid rgba(244,114,182,0.2); }
  .tag-hard { background: rgba(255,94,125,0.1); color: var(--danger); border: 1px solid rgba(255,94,125,0.2); }
  .tag-medium { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .tag-easy { background: rgba(0,229,192,0.1); color: var(--accent2); border: 1px solid rgba(0,229,192,0.2); }

  .tip-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
  .tip-num { color: var(--accent); font-weight: 700; font-size: 0.9rem; min-width: 20px; font-family: 'Syne', sans-serif; }
  .tip-text { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; margin-right: 10px; vertical-align: middle; }

  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  @media (max-width: 600px) {
    .grid2 { grid-template-columns: 1fr; }
    .score-num { font-size: 5rem; }
    .step-line { width: 30px; }
  }
`;

function scoreColor(s) {
  return s >= 80 ? "#00e5c0" : s >= 60 ? "#fbbf24" : s >= 40 ? "#fb923c" : "#ff5e7d";
}

export default function App() {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [scoreData, setScoreData] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return setError("Please select a PDF file");
    if (!jd.trim()) return setError("Please paste a job description");
    setLoading(true); setError("");
    setLoadMsg("Extracting resume text...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API}/upload`, formData);
      const text = res.data.full_text;
      setResumeText(text);
      setLoadMsg("Calculating ATS score...");
      const scoreRes = await axios.post(`${API}/score`, { resume_text: text, job_description: jd });
      setScoreData(scoreRes.data);
      setStep("score");
    } catch (e) {
      setError("Backend not running. Start it with: uvicorn main:app --reload");
    }
    setLoading(false); setLoadMsg("");
  };

  const handleGetQuestions = async () => {
    setLoading(true); setError("");
    setLoadMsg("Generating personalized questions with AI...");
    try {
      const res = await axios.post(`${API}/interview-questions`, { resume_text: resumeText, job_description: jd });
      setQuestions(res.data);
      setStep("questions");
    } catch (e) {
      setError("Failed to generate questions. Try again.");
    }
    setLoading(false); setLoadMsg("");
  };

  const reset = () => {
    setStep("upload"); setScoreData(null); setQuestions(null);
    setFile(null); setJd(""); setResumeText(""); setError("");
  };

  const stepNum = step === "upload" ? 1 : step === "score" ? 2 : 3;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="wrap">

          {/* Hero */}
          <div className="hero fade-up">
            <div className="hero-badge">✦ AI Powered</div>
            <h1>Resume Analyzer<br />& Interview Copilot</h1>
            <p>Upload your resume · Get ATS score · Ace your interview</p>
          </div>

          {/* Steps */}
          <div className="steps-bar fade-up-2">
            {[["1","Upload"], ["2","ATS Score"], ["3","Interview Prep"]].map(([n, label], i) => (
              <>
                {i > 0 && <div className="step-line" key={`line-${i}`} />}
                <div className="step-item" key={n}>
                  <div className={`step-dot ${stepNum === i+1 ? "active" : stepNum > i+1 ? "done" : ""}`}>
                    {stepNum > i+1 ? "✓" : n}
                  </div>
                  <span className="step-label">{label}</span>
                </div>
              </>
            ))}
          </div>

          {/* UPLOAD */}
          {step === "upload" && (
            <div className="fade-up-3">
              <div className="card card-glow">
                <div style={{ marginBottom: "24px" }}>
                  <label>📄 Resume (PDF)</label>
                  <div className="file-zone">
                    <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                    <div className="file-icon">📋</div>
                    <div className="file-text">{file ? "" : "Click to upload or drag & drop"}</div>
                    {file && <div className="file-selected">✅ {file.name}</div>}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label>📋 Job Description</label>
                  <textarea rows={7} value={jd} onChange={e => setJd(e.target.value)}
                    placeholder="Paste the full job description here..." />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                  {loading ? <><span className="spinner" />{loadMsg}</> : "Analyze My Resume →"}
                </button>
              </div>
            </div>
          )}

          {/* SCORE */}
          {step === "score" && scoreData && (
            <div className="fade-up">
              <div className="card card-glow">
                <div className="score-hero">
                  <p className="score-label">Your ATS Score</p>
                  <p className="score-num" style={{ color: scoreColor(scoreData.ats_score) }}>
                    {scoreData.ats_score}%
                  </p>
                  <p className="score-grade">{scoreData.grade}</p>
                  <p className="score-verdict">{scoreData.verdict}</p>
                  <p className="score-summary">{scoreData.summary}</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{
                      "--target": `${scoreData.ats_score}%`,
                      background: `linear-gradient(90deg, ${scoreColor(scoreData.ats_score)}, ${scoreColor(scoreData.ats_score)}88)`
                    }} />
                  </div>
                </div>
              </div>

              <div className="card">
                <p className="section-title" style={{ color: "#00e5c0" }}>✅ Matched Skills — {scoreData.matched_skills.length}</p>
                <div className="tags">
                  {scoreData.matched_skills.map(s => <span key={s} className="tag tag-green">{s}</span>)}
                </div>
              </div>

              <div className="card">
                <p className="section-title" style={{ color: "#ff5e7d" }}>❌ Missing Skills — {scoreData.missing_skills.length}</p>
                <div className="tags">
                  {scoreData.missing_skills.map(s => <span key={s} className="tag tag-red">{s}</span>)}
                </div>
                {scoreData.missing_skills.length > 0 && (
                  <p style={{ color: "#3a3f56", fontSize: "0.78rem", marginTop: "14px" }}>
                    💡 Add these to your resume to boost your ATS score
                  </p>
                )}
              </div>

              <div className="grid2" style={{ marginBottom: "16px" }}>
                <button className="btn btn-teal" onClick={handleGetQuestions} disabled={loading}>
                  {loading ? <><span className="spinner" />{loadMsg}</> : "🎯 Interview Questions →"}
                </button>
                <button className="btn btn-ghost" onClick={reset}>↩ Start Over</button>
              </div>
              {error && <p className="error-msg">{error}</p>}
            </div>
          )}

          {/* QUESTIONS */}
          {step === "questions" && questions && (
            <div className="fade-up">
              <div className="card" style={{ background: "linear-gradient(135deg, rgba(124,107,255,0.15), rgba(0,229,192,0.08))", borderColor: "rgba(124,107,255,0.3)", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: "6px" }}>🎯 Your Interview Prep Kit</h2>
                <p style={{ color: "#7c6bff", fontSize: "0.83rem" }}>Tailored to your resume & target role</p>
              </div>

              {[
                { key: "technical_questions", title: "💻 Technical", color: "#a89fff", tagClass: "tag-blue", sub: q => <>{q.topic && <span className="tag tag-blue">{q.topic}</span>}{q.difficulty && <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>}</> },
                { key: "project_questions", title: "🚀 Project-Based", color: "#fbbf24", tagClass: "tag-yellow", sub: q => q.project && <span className="tag tag-yellow">{q.project}</span> },
                { key: "behavioral_questions", title: "🧠 Behavioral", color: "#f472b6", tagClass: "tag-pink", sub: q => q.competency && <span className="tag tag-pink">{q.competency}</span> },
              ].map(({ key, title, color, sub }) => (
                <div className="card" key={key}>
                  <p className="section-title" style={{ color }}>{title}</p>
                  {questions[key]?.map((q, i) => (
                    <div className="q-card" key={i}>
                      <p className="q-num">Question {i + 1}</p>
                      <p className="q-text">{q.question}</p>
                      <div className="q-tags">{sub(q)}</div>
                    </div>
                  ))}
                </div>
              ))}

              {questions.tips?.length > 0 && (
                <div className="card">
                  <p className="section-title" style={{ color: "#00e5c0" }}>💡 Interview Tips</p>
                  {questions.tips.map((tip, i) => (
                    <div className="tip-row" key={i}>
                      <span className="tip-num">{i + 1}.</span>
                      <p className="tip-text">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-ghost" onClick={reset}>↩ Analyze Another Resume</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}