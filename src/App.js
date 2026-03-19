import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const totalStudents = 71;
  const rollNumbers = Array.from({ length: totalStudents }, (_, i) => i + 1);

  const [present, setPresent] = useState([]);
  const [result, setResult] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const toggleAttendance = (roll) => {
    if (present.includes(roll)) {
      setPresent(present.filter(r => r !== roll));
    } else {
      setPresent([...present, roll]);
    }
  };

  const submitAttendance = async () => {
    const absent = rollNumbers.filter(r => !present.includes(r));

    try {
      await setDoc(doc(db, "attendance", today), {
        present,
        absent,
        timestamp: serverTimestamp()
      });

      setResult({
        presentCount: present.length,
        absentCount: absent.length,
        absentList: absent
      });

      alert("Attendance Saved Successfully!");

    } catch (error) {
      console.error(error);
      alert("Error saving attendance");
    }
  };

  const copyAbsent = () => {
    if (!result) return;

    const message = `Absent Roll Numbers:\n${result.absentList.join(", ")}`;
    navigator.clipboard.writeText(message);

    alert("Absent list copied!");
  };

  const attendancePercentage = totalStudents > 0 
    ? Math.round((present.length / totalStudents) * 100) 
    : 0;

  return (
    <div style={styles.container}>
      <style>{cssAnimations}</style>

      {/* Animated Background */}
      <div style={styles.backgroundEffect}></div>
      <div style={styles.backgroundGradient}></div>

      {/* Main Card */}
      <div style={styles.mainCard}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <h1 style={styles.title}>
            <span style={styles.emoji}>📋</span>
            <span>Daily Attendance</span>
          </h1>
          
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <span style={styles.statValue}>{present.length}</span>
              <span style={styles.statLabel}>Present</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statBox}>
              <span style={styles.statValue}>{totalStudents - present.length}</span>
              <span style={styles.statLabel}>Absent</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statBox}>
              <span style={styles.statValue}>{attendancePercentage}%</span>
              <span style={styles.statLabel}>Attendance</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBarContainer}>
            <div style={{
              ...styles.progressBar,
              width: `${attendancePercentage}%`,
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}></div>
          </div>
        </div>

        {/* Roll Numbers Grid */}
        <div style={styles.gridContainer}>
          <div style={styles.grid}>
            {rollNumbers.map((roll, index) => {
              const isPresent = present.includes(roll);
              return (
                <button
                  key={roll}
                  onClick={() => toggleAttendance(roll)}
                  style={{
                    ...styles.rollButton,
                    ...styles.baseButton,
                    ...(isPresent ? styles.presentButton : styles.absentButton),
                    animationDelay: `${index * 0.02}s`
                  }}
                  className="roll-btn"
                >
                  {roll}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtonsContainer}>
          <button
            onClick={submitAttendance}
            style={styles.submitButton}
            className="pulse-btn"
          >
            <span style={{ fontSize: "18px", marginRight: "8px" }}>🚀</span>
            Submit Attendance
          </button>

          <button
            onClick={() => setPresent([])}
            style={styles.resetButton}
          >
            <span style={{ fontSize: "16px", marginRight: "8px" }}>↻</span>
            Reset All
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div style={styles.resultSection} className="fade-in-up">
            <h2 style={styles.resultTitle}>📊 Attendance Summary</h2>

            {/* Summary Stats */}
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryNumber}>{result.presentCount}</div>
                <div style={styles.summaryLabel}>Present</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryNumber}>{result.absentCount}</div>
                <div style={styles.summaryLabel}>Absent</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryNumber}>{attendancePercentage}%</div>
                <div style={styles.summaryLabel}>Rate</div>
              </div>
            </div>

            {/* Present List */}
            <div style={styles.listSection}>
              <h3 style={styles.listTitle}>✅ Present Roll Numbers</h3>
              <div style={styles.listContent}>
                {present.sort((a, b) => a - b).join(", ")}
              </div>
            </div>

            {/* Absent List */}
            <div style={styles.listSection}>
              <h3 style={styles.listTitle}>❌ Absent Roll Numbers</h3>
              <div style={styles.listContent}>
                {result.absentList.join(", ")}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyAbsent}
              style={styles.copyButton}
            >
              <span style={{ fontSize: "16px", marginRight: "8px" }}>📋</span>
              Copy Absent List to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#0f1419",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },

  backgroundEffect: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
    zIndex: 1,
    pointerEvents: "none"
  },

  backgroundGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(15, 20, 25, 0.98) 0%, rgba(25, 35, 45, 0.98) 100%)",
    zIndex: 0,
    pointerEvents: "none"
  },

  mainCard: {
    position: "relative",
    zIndex: 10,
    background: "rgba(255, 255, 255, 0.07)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "24px",
    padding: "40px 30px",
    maxWidth: "1100px",
    width: "100%",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    animation: "slideUp 0.6s ease-out"
  },

  headerSection: {
    marginBottom: "35px",
    animation: "fadeIn 0.8s ease-out"
  },

  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 25px 0",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  },

  emoji: {
    fontSize: "2.8rem",
    display: "inline-block",
    animation: "bounce 2s infinite"
  },

  statsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  statBox: {
    textAlign: "center",
    minWidth: "100px"
  },

  statValue: {
    display: "block",
    fontSize: "2rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "5px"
  },

  statLabel: {
    display: "block",
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600"
  },

  statDivider: {
    width: "1px",
    height: "50px",
    background: "rgba(255, 255, 255, 0.1)",
  },

  progressBarContainer: {
    width: "100%",
    height: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
  },

  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)"
  },

  gridContainer: {
    marginBottom: "30px",
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: "10px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
    gap: "10px",
    minWidth: "100%"
  },

  baseButton: {
    padding: "12px 8px",
    borderRadius: "12px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "scaleIn 0.5s ease-out forwards",
  },

  rollButton: {
    color: "white",
    position: "relative",
    overflow: "hidden"
  },

  presentButton: {
    background: "linear-gradient(135deg, #10b981, #34d399)",
    boxShadow: "0 8px 16px rgba(16, 185, 129, 0.4)",
    transform: "scale(1)"
  },

  absentButton: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "rgba(255, 255, 255, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },

  actionButtonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  submitButton: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(135deg, #ec4899, #f43f5e)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 15px 30px rgba(236, 72, 153, 0.4)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "fadeIn 0.8s ease-out 0.2s backwards"
  },

  resetButton: {
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "fadeIn 0.8s ease-out 0.3s backwards"
  },

  resultSection: {
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "10px",
    animation: "fadeInUp 0.6s ease-out"
  },

  resultTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "25px",
    textAlign: "center"
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "15px",
    marginBottom: "25px"
  },

  summaryCard: {
    padding: "20px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    textAlign: "center",
    transition: "all 0.3s ease"
  },

  summaryNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px"
  },

  summaryLabel: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600"
  },

  listSection: {
    marginBottom: "20px"
  },

  listTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  listContent: {
    padding: "15px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    wordBreak: "break-word",
    fontFamily: "monospace"
  },

  copyButton: {
    width: "100%",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 15px 30px rgba(6, 182, 212, 0.3)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px"
  }
};

const cssAnimations = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 15px 30px rgba(236, 72, 153, 0.4);
    }
    50% {
      box-shadow: 0 15px 40px rgba(236, 72, 153, 0.6);
    }
  }

  .pulse-btn {
    animation: pulse 2s infinite !important;
  }

  .roll-btn:hover {
    transform: scale(1.08) !important;
  }

  .roll-btn:active {
    transform: scale(0.95) !important;
  }

  button:hover {
    transform: translateY(-2px);
  }

  button:active {
    transform: translateY(0);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    div[style*="padding: 40px 30px"] {
      padding: 25px 20px !important;
    }

    h1[style*="fontSize: 2.5rem"] {
      font-size: 2rem !important;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat"] {
      grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)) !important;
      gap: 8px !important;
    }

    button[style*="padding: 14px 32px"] {
      padding: 12px 24px !important;
      font-size: 15px !important;
    }
  }

  @media (max-width: 480px) {
    div[style*="padding: 40px 30px"] {
      padding: 20px 15px !important;
    }

    h1[style*="fontSize: 2.5rem"] {
      font-size: 1.5rem !important;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat"] {
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)) !important;
      gap: 6px !important;
    }

    div[style*="fontSize: 2rem"][style*="fontWeight: 700"][style*="marginBottom: 5px"] {
      font-size: 1.5rem !important;
    }

    button[style*="padding: 14px 32px"] {
      padding: 10px 20px !important;
      font-size: 14px !important;
      flex: 1;
    }

    div[style*="display: flex"][style*="justifyContent: center"][style*="gap: 20px"] {
      flex-direction: column !important;
      gap: 10px !important;
    }
  }
`;

