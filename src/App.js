import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function App() {

  // total students
  const totalStudents = 71;

  // generate roll numbers
  const rollNumbers = Array.from({ length: totalStudents }, (_, i) => i + 1);

  // state for present students
  const [present, setPresent] = useState([]);

  const [result, setResult] = useState(null);

  // current date
  const today = new Date().toISOString().split("T")[0];

  // toggle attendance
  const toggleAttendance = (roll) => {

    if (present.includes(roll)) {
      setPresent(present.filter(r => r !== roll));
    } else {
      setPresent([...present, roll]);
    }
  };

  // submit attendance
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

  // copy absent numbers
const copyAbsent = () => {

  if (!result) return;

  const message = `Absent Roll Numbers:\n${result.absentList.join(", ")}`;

  navigator.clipboard.writeText(message);

  alert("Absent list copied!");
};

  return (

    <div style={{ fontFamily: "Arial", padding: 20 }}>

      {/* Title */}
      <h1 style={{ textAlign: "center" }}>
        Daily Class Attendance
      </h1>

      {/* Roll Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(10,1fr)",
        gap: "10px"
      }}>

        {rollNumbers.map((roll) => (

          <div
            key={roll}
            onClick={() => toggleAttendance(roll)}
            style={{
              padding: "12px",
              textAlign: "center",
              border: "1px solid #ccc",
              cursor: "pointer",
              borderRadius: "6px",
              backgroundColor: present.includes(roll) ? "#4CAF50" : "#f5f5f5",
              color: present.includes(roll) ? "white" : "black",
              fontWeight: "bold"
            }}
          >

            {roll}

          </div>

        ))}

      </div>

      {/* Submit Button */}

      <div style={{ textAlign: "center", marginTop: 30 }}>

        <button
          onClick={submitAttendance}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Submit Attendance
        </button>

      </div>
      {/* Result Section */}

      {result && (

        <div style={{
        marginTop: 40,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: "10px"
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
            background: "#ffebee",
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
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
            }} >
            Copy Absent List
          </button>
  
          </div>

        )}

    </div>
  );
}
