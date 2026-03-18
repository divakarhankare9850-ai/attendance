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

  return (

    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1f4037, #99f2c8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      fontFamily: "Poppins, sans-serif"
    }}>

      {/* Main Card */}
      <div style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        padding: "30px",
        borderRadius: "18px",
        width: "950px",
        maxWidth: "100%",
        boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>

        {/* Title */}
        <h1 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#fff",
          fontWeight: "700",
          letterSpacing: "1px"
        }}>
          📋 Daily Class Attendance
        </h1>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(10,1fr)",
          gap: "12px",
          marginBottom: "25px"
        }}>

          {rollNumbers.map((roll) => {

            const isPresent = present.includes(roll);

            return (
              <div
                key={roll}
                onClick={() => toggleAttendance(roll)}
                style={{
                  padding: "14px",
                  textAlign: "center",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "0.25s",
                  transform: isPresent ? "scale(1.05)" : "scale(1)",
                  background: isPresent
                    ? "linear-gradient(135deg,#00c853,#64dd17)"
                    : "rgba(255,255,255,0.2)",
                  color: isPresent ? "white" : "#fff",
                  boxShadow: isPresent
                    ? "0 5px 15px rgba(0,200,83,0.4)"
                    : "0 2px 5px rgba(0,0,0,0.1)"
                }}
              >
                {roll}
              </div>
            );
          })}

        </div>

        {/* Buttons Row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: 10
        }}>

          <button
            onClick={submitAttendance}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              background: "linear-gradient(135deg,#ff512f,#dd2476)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 8px 20px rgba(221,36,118,0.4)",
              transition: "0.2s"
            }}
          >
            🚀 Submit
          </button>

          <button
            onClick={() => setPresent([])}
            style={{
              padding: "14px 20px",
              fontSize: "14px",
              background: "linear-gradient(135deg,#434343,#000000)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 5px 15px rgba(0,0,0,0.4)"
            }}
          >
            Reset
          </button>

        </div>

        {/* Result Section */}
        {result && (

          <div style={{
            marginTop: 30,
            padding: 20,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            color: "#fff"
          }}>

            <h2>📊 Attendance Summary</h2>

            <p><b>Present:</b> {result.presentCount}</p>
            <p><b>Absent:</b> {result.absentCount}</p>

            {/* Present */}
            <h3>✅ Present</h3>
            <div style={{
              background: "rgba(0,200,83,0.2)",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px"
            }}>
              {present.sort((a,b)=>a-b).join(", ")}
            </div>

            {/* Absent */}
            <h3>❌ Absent</h3>
            <div style={{
              background: "rgba(255,0,0,0.2)",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px"
            }}>
              {result.absentList.join(", ")}
            </div>

            {/* Copy Button */}
            <button
              onClick={copyAbsent}
              style={{
                padding: "12px 22px",
                background: "linear-gradient(135deg,#00c6ff,#0072ff)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 5px 15px rgba(0,114,255,0.4)"
              }}
            >
              📋 Copy Absent List
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
