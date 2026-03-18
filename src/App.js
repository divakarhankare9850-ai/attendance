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
        present: present,
        absent: absent,
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
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      fontFamily: "Arial, sans-serif"
    }}>

      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "900px",
        maxWidth: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>

        {/* Title */}
        <h1 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#333"
        }}>
          Daily Class Attendance
        </h1>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(10,1fr)",
          gap: "12px",
          marginBottom: "25px"
        }}>

          {rollNumbers.map((roll) => (

            <div
              key={roll}
              onClick={() => toggleAttendance(roll)}
              style={{
                padding: "14px",
                textAlign: "center",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.2s",
                backgroundColor: present.includes(roll) ? "#2ecc71" : "#f1f3f5",
                color: present.includes(roll) ? "white" : "#333",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              {roll}
            </div>

          ))}

        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginTop: 10 }}>

          <button
            onClick={submitAttendance}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              background: "linear-gradient(135deg,#36d1dc,#5b86e5)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
            }}
          >
            Submit Attendance
          </button>

        </div>

        {/* Result Section */}
        {result && (

          <div style={{
            marginTop: 30,
            padding: 20,
            borderRadius: "10px",
            background: "#f8f9fa"
          }}>

            <h2>Attendance Summary</h2>

            <p><b>Present Count:</b> {result.presentCount}</p>
            <p><b>Absent Count:</b> {result.absentCount}</p>

            {/* Present Numbers */}
            <h3>Present Roll Numbers</h3>

            <div style={{
              background: "#e8f5e9",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "20px"
            }}>
              {present.sort((a,b)=>a-b).join(", ")}
            </div>

            {/* Absent Numbers */}
            <h3>Absent Roll Numbers</h3>

            <div style={{
              background: "#ffecec",
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
                padding: "10px 20px",
                background: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Copy Absent List
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
