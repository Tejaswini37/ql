import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // const response = await fetch("http://localhost:8080/shorten", {
      const response = await fetch("https://quicklink-backend-ih4p.onrender.com/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ originalUrl: url })
      });

      if (!response.ok) throw new Error();

      const data = await response.text();

      // setShortUrl(data);
      setShortUrl("https://quicklink-backend-ih4p.onrender.com/" + data);


      setHistory((prev) => {
        const updated = [{ original: url, short: data }, ...prev];
        return updated.slice(0, 5);
      });

      setUrl("");
    } catch {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setError("Copy failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 QuickLink</h1>
        <p style={styles.subtitle}>Shorten your long URLs instantly</p>

        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {shortUrl && (
          <div style={styles.resultBox}>
            <p>Your Short URL:</p>
            <div style={styles.copyRow}>
              <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.link}>
                {shortUrl}
              </a>
              <button
                style={styles.copyBtn}
                onClick={() => copyToClipboard(shortUrl, "main")}
              >
                {copiedIndex === "main" ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div style={styles.historySection}>
            <h3>Recent Links</h3>
            {history.map((item, index) => (
              <div key={index} style={styles.historyItem}>
                <small style={{ color: "#555" }}>{item.original}</small>
                <div style={styles.copyRow}>
                  <a href={item.short} target="_blank" rel="noreferrer" style={styles.link}>
                    {item.short}
                  </a>
                  <button
                    style={styles.copyBtn}
                    onClick={() => copyToClipboard(item.short, index)}
                  >
                    {copiedIndex === index ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "18px",
    width: "480px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
    textAlign: "center"
  },
  title: {
    marginBottom: "5px"
  },
  subtitle: {
    fontSize: "14px",
    color: "gray",
    marginBottom: "25px"
  },
  inputGroup: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none"
  },
  button: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  },
  buttonDisabled: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#a5b4fc",
    color: "white",
    cursor: "not-allowed"
  },
  resultBox: {
    marginTop: "22px",
    padding: "16px",
    background: "#f4f6ff",
    borderRadius: "12px"
  },
  historySection: {
    marginTop: "28px",
    textAlign: "left"
  },
  historyItem: {
    background: "#f9f9ff",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "12px"
  },
  copyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "6px"
  },
  copyBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
    fontSize: "12px"
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    wordBreak: "break-all"
  },
  error: {
    color: "red",
    marginTop: "12px"
  }
};

export default App;
