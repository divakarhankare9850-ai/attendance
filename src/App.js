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

  const copyPresent = () => {
    if (!result) return;

    const message = `Present Roll Numbers:\n${present.sort((a, b) => a - b).join(", ")}`;
    navigator.clipboard.writeText(message);

    alert("Present list copied!");
  };

  const attendancePercentage = totalStudents > 0 
    ? Math.round((present.length / totalStudents) * 100) 
    : 0;

  return (
    <div style={styles.container}>
      <style>{cssAnimations}</style>

      {/* Elegant Background */}
      <div style={styles.backgroundGradient}></div>
      <div style={styles.backgroundOverlay}></div>

      {/* Main Container */}
      <div style={styles.wrapper}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Attendance</h1>
            <p style={styles.subtitle}>Daily roll call management</p>
          </div>
          <div style={styles.dateDisplay}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        </header>

        {/* Stats Overview */}
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✓</div>
            <div style={styles.statInfo}>
              <div style={styles.statNumber}>{present.length}</div>
              <div style={styles.statName}>Present</div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✕</div>
            <div style={styles.statInfo}>
              <div style={styles.statNumber}>{totalStudents - present.length}</div>
              <div style={styles.statName}>Absent</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>%</div>
            <div style={styles.statInfo}>
              <div style={styles.statNumber}>{attendancePercentage}%</div>
              <div style={styles.statName}>Rate</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div style={{
              ...styles.progressFill,
              width: `${attendancePercentage}%`,
            }}></div>
          </div>
          <div style={styles.progressText}>{present.length} of {totalStudents} students</div>
        </div>

        {/* Roll Numbers Section */}
        <div style={styles.rollSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Mark Attendance</h2>
            <span style={styles.sectionHint}>{present.length} selected</span>
          </div>

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
                      ...(isPresent ? styles.rollButtonActive : styles.rollButtonInactive),
                      animationDelay: `${index * 0.01}s`
                    }}
                    className="roll-btn"
                    title={`Roll ${roll}`}
                  >
                    {roll}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            onClick={submitAttendance}
            style={styles.submitBtn}
            className="btn-primary"
          >
            Save Attendance
          </button>

          <button
            onClick={() => setPresent([])}
            style={styles.resetBtn}
            className="btn-secondary"
          >
            Clear Selection
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div style={styles.resultCard} className="result-appear">
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>Summary</h2>
              <p style={styles.resultDate}>{today}</p>
            </div>

            {/* Result Stats */}
            <div style={styles.resultStats}>
              <div style={styles.resultStat}>
                <div style={styles.resultStatValue}>{result.presentCount}</div>
                <div style={styles.resultStatLabel}>Present</div>
              </div>
              <div style={styles.resultStatDivider}></div>
              <div style={styles.resultStat}>
                <div style={styles.resultStatValue}>{result.absentCount}</div>
                <div style={styles.resultStatLabel}>Absent</div>
              </div>
              <div style={styles.resultStatDivider}></div>
              <div style={styles.resultStat}>
                <div style={styles.resultStatValue}>{attendancePercentage}%</div>
                <div style={styles.resultStatLabel}>Attendance</div>
              </div>
            </div>

            {/* Lists */}
            <div style={styles.listContainer}>
              {result.absentCount > 0 && (
                <div style={styles.listBlock}>
                  <h3 style={styles.listTitle}>Absent Students</h3>
                  <div style={styles.listContent}>
                    {result.absentList.join(", ")}
                  </div>
                  <button
                    onClick={copyAbsent}
                    style={styles.copyBtn}
                  >
                    Copy Absent List
                  </button>
                </div>
              )}

              {present.length > 0 && (
                <div style={styles.listBlock}>
                  <h3 style={styles.listTitle}>Present Students</h3>
                  <div style={styles.listContent}>
                    {present.sort((a, b) => a - b).join(", ")}
                  </div>
                  <button
                    onClick={copyPresent}
                    style={styles.copyBtn}
                  >
                    Copy Present List
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "20px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
  },

  backgroundGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    zIndex: 0,
  },

  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
    zIndex: 0,
    pointerEvents: "none"
  },

  wrapper: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "900px",
    paddingTop: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
    animation: "slideDown 0.6s ease-out"
  },

  headerContent: {
    flex: 1,
  },

  mainTitle: {
    fontSize: "2.8rem",
    fontWeight: "800",
    color: "white",
    margin: "0",
    letterSpacing: "-0.8px",
    lineHeight: "1.1"
  },

  subtitle: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.8)",
    margin: "8px 0 0 0",
    fontWeight: "400",
    letterSpacing: "0.3px"
  },

  dateDisplay: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.9)",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "8px 16px",
    borderRadius: "8px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    fontWeight: "500"
  },

  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "32px",
    animation: "fadeIn 0.8s ease-out 0.1s backwards"
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default"
  },

  statIcon: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "white",
    fontWeight: "bold",
    flexShrink: 0
  },

  statInfo: {
    flex: 1,
  },

  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1a202c",
    lineHeight: "1"
  },

  statName: {
    fontSize: "0.85rem",
    color: "#718096",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "4px"
  },

  progressContainer: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.8s ease-out 0.2s backwards"
  },

  progressTrack: {
    width: "100%",
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "12px",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "10px",
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 20px rgba(102, 126, 234, 0.6)"
  },

  progressText: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#4a5568",
    fontWeight: "500"
  },

  rollSection: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "28px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.8s ease-out 0.3s backwards"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0"
  },

  sectionHint: {
    fontSize: "0.9rem",
    color: "#718096",
    fontWeight: "500",
    background: "#edf2f7",
    padding: "6px 12px",
    borderRadius: "20px"
  },

  gridContainer: {
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: "8px",
    marginBottom: "-8px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
    gap: "10px",
    minWidth: "100%"
  },

  rollButton: {
    padding: "12px 8px",
    borderRadius: "10px",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "scaleUp 0.4s ease-out forwards",
  },

  rollButtonActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
    transform: "scale(1)"
  },

  rollButtonInactive: {
    background: "#f7fafc",
    color: "#4a5568",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
  },

  actionButtons: {
    display: "flex",
    gap: "16px",
    marginBottom: "28px",
    animation: "fadeIn 0.8s ease-out 0.4s backwards"
  },

  submitBtn: {
    flex: 1,
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(102, 126, 234, 0.35)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    letterSpacing: "0.3px"
  },

  resetBtn: {
    flex: 1,
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#4a5568",
    background: "rgba(255, 255, 255, 0.95)",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    letterSpacing: "0.3px",
    backdropFilter: "blur(20px)"
  },

  resultCard: {
    background: "rgba(255, 255, 255, 0.97)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
    animation: "slideUp 0.6s ease-out"
  },

  resultHeader: {
    marginBottom: "28px",
  },

  resultTitle: {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#1a202c",
    margin: "0 0 4px 0"
  },

  resultDate: {
    fontSize: "0.9rem",
    color: "#718096",
    margin: "0",
    fontWeight: "500"
  },

  resultStats: {
    display: "flex",
    justifyContent: "space-around",
    padding: "24px",
    background: "#f7fafc",
    borderRadius: "12px",
    marginBottom: "28px"
  },

  resultStat: {
    textAlign: "center",
    flex: 1
  },

  resultStatValue: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#667eea",
    lineHeight: "1"
  },

  resultStatLabel: {
    fontSize: "0.85rem",
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600",
    marginTop: "6px"
  },

  resultStatDivider: {
    width: "1px",
    height: "50px",
    background: "#e2e8f0",
    alignSelf: "center"
  },

  listContainer: {
    display: "grid",
    gap: "20px"
  },

  listBlock: {
    padding: "20px",
    background: "#f7fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },

  listTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 12px 0"
  },

  listContent: {
    padding: "14px",
    background: "white",
    borderRadius: "8px",
    color: "#2d3748",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    wordBreak: "break-word",
    fontFamily: "monospace",
    fontWeight: "500",
    border: "1px solid #e2e8f0",
    marginBottom: "12px",
    maxHeight: "120px",
    overflowY: "auto"
  },

  copyBtn: {
    width: "100%",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)"
  }
};

const cssAnimations = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

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

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .roll-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3) !important;
  }

  .roll-btn:active {
    transform: translateY(0) scale(0.95);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.45) !important;
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #cbd5e0;
    transform: translateY(-2px);
  }

  .btn-secondary:active {
    transform: translateY(0);
  }

  .result-appear {
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .statCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  }

  /* Scrollbar Styling */
  div::-webkit-scrollbar {
    height: 6px;
  }

  div::-webkit-scrollbar-track {
    background: transparent;
  }

  div::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }

  div::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    h1[style*="fontSize: 2.8rem"] {
      font-size: 2.2rem !important;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat(3"] {
      grid-template-columns: 1fr !important;
    }

    div[style*="display: flex"][style*="justifyContent: space-between"] {
      flex-direction: column;
      gap: 12px;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat(auto-fill"] {
      grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)) !important;
      gap: 8px !important;
    }

    button[style*="flex: 1"] {
      padding: 12px 20px !important;
      font-size: 14px !important;
    }
  }

  @media (max-width: 480px) {
    h1[style*="fontSize: 2.8rem"] {
      font-size: 1.8rem !important;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat(3"] {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }

    div[style*="padding: 20px"][style*="display: flex"][style*="gap: 16px"] {
      padding: 16px !important;
      flex-direction: column;
      gap: 12px !important;
    }

    div[style*="display: grid"][style*="gridTemplateColumns: repeat(auto-fill"] {
      grid-template-columns: repeat(auto-fill, minmax(38px, 1fr)) !important;
      gap: 6px !important;
    }

    button[style*="padding: 14px 28px"] {
      padding: 12px 20px !important;
      font-size: 14px !important;
    }

    div[style*="padding: 28px"] {
      padding: 20px !important;
    }

    div[style*="padding: 32px"] {
      padding: 20px !important;
    }
  }
`;
