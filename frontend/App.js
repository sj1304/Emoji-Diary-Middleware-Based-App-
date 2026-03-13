import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "./images/diary_PNG7.png";

const API = "http://localhost:5000";

function App() {
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [sticky, setSticky] = useState(null);

  const emojis = [
    "😊","😁","😄","🙂","😌","😇",
    "🥰","😍","😎","🤩","😜","🤗",
    "😴","🥱","😪","😢","😭","😞",
    "😔","😡","😤","😰","😱","😳",
    "🥺","🤔","🤭","😶","😐","😑"
  ];

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/entries`);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching entries", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async () => {
    if (!date || !sticky) {
      alert("Please enter day and drop an emoji");
      return;
    }

    try {
      await axios.post(`${API}/add`, {
        emoji: sticky.emoji,
        date
      });

      setDate("");
      setSticky(null);
      fetchEntries();
    } catch (err) {
      console.error("Error adding entry", err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchEntries();
    } catch (err) {
      console.error("Error deleting entry", err);
    }
  };

  return (
    <div style={styles.mainContainer}>
    <i><u><h1 style={styles.h1}>~My Dairy</h1></u></i>
      {/* TOP SECTION */}
      <div style={styles.topFlex}>
       
        {/* DIARY IMAGE */}
        <div
          style={styles.imageContainer}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const emojiDropped = e.dataTransfer.getData("emoji");
            setSticky({ emoji: emojiDropped });
          }}
        >
          {/* EMOJI DROP BOX ON STICKY NOTE */}
          <div style={styles.emojiDropBox}>
            {sticky ? (
              <span style={styles.droppedEmoji}>{sticky.emoji}</span>
            ) : (
              <span style={styles.dropText}>Drop Sticky Here</span>
            )}
          </div>

 {/* DATE INPUT SECTION */}
          <div style={styles.overlay}>
            <label style={styles.label}>Enter Day</label>
            <input
              type="text"
              placeholder="e.g., Monday"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {/* ADD ENTRY BUTTON */}
          <button onClick={addEntry} style={styles.addButton}>
            Add Entry
          </button>

         
        </div>

        {/* EMOJI GRID */}
        <div style={styles.emojiContainer}>
          <h3 style={styles.emojiTitle}>Choose Sticky</h3>

          <div style={styles.emojiGrid}>
            {emojis.map((emoji, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("emoji", emoji)
                }
                style={styles.emojiItem}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DIARY ENTRIES */}
      <div style={styles.bottomFlex}>
        <u><h1 styles={styles.h1}>Diary Entries</h1></u>

        {entries.length === 0 ? (
          <p style={styles.noEntries}>No entries yet</p>
        ) : (
          <div style={styles.entriesGrid}>
            {entries.map((entry) => (
              <div key={entry._id} style={styles.card}>
                <h2 style={styles.entryEmoji}>{entry.emoji}</h2>
                <p style={styles.entryDate}><strong>Day:</strong> {entry.date}</p>

                <button
                  onClick={() => deleteEntry(entry._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {

  mainContainer: {
    fontFamily: "Arial, sans-serif",
    margin: "10px auto",
    maxWidth: "1200px",
    padding: "0 20px",
    textAlign:"center",
    
  },

      h1: {
      fontSize: "46px",
      textAlign: "center",
      fontWeight: "700",
      letterSpacing: "2px",
      margin: "0px 100px 10px 100px",
      borderRadius:"50%",
      fontFamily: "Poppins, sans-serif",
      background: "linear-gradient(180deg, #a7c7fc8e, #ffffffb8)",
      
      color:"#312e2e"
    },
  

  topFlex: {
    display: "flex",
    padding: "5px",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap"
  },

  imageContainer: {
    height: "560px",
    width: "450px",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "10px",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    border:"1px solid black"
  },

  // Positioned on the yellow sticky note
  emojiDropBox: {
    position: "absolute",
    top: "20px",
    right: "65px",
    width: "120px",
    height: "120px",
    backgroundColor: "rgba(254, 230, 8, 0.31)",
    border: "2px dashed #f9a825",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10
  },

  droppedEmoji: {
    fontSize: "50px"
  },

  dropText: {
    color: "#795548",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    padding: "5px"
  },

  addButton: {
    position: "absolute",
    top: "380px",
    left: "150px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "25px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.26)",
    transition: "background-color 0.3s ease"
  },

  overlay: {
    position: "absolute",
    bottom: "230px",
    left: "110px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems:"center"
  },

  label: {
    color: "#454545",
    fontSize: "38px",
    //fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",

  },

  dateInput: {
    padding: "10px",
    width: "210px",
    fontSize: "20px",
    border: "2px solid #0c0c0c",
    borderRadius: "5px",
    backgroundColor: "rgba(255,255,255,0.9)",
    margin:"20px 0",
    textAlign:"center"
  },

  emojiContainer: {
    border: "1px solid #0a0a0a",
    borderRadius: "10px",
    padding: "20px",
    width: "500px",
    backgroundColor: "#f1f8d1",
    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.26)"
  },

  emojiTitle: {
    marginTop: "0",
    marginBottom: "30px",
    color: "#333",
    fontSize: "30px"
  },

  emojiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "15px",
    marginTop: "10px",
    
  },

  emojiItem: {
    fontSize: "30px",
    padding: "12px",
    textAlign: "center",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "grab",
    background: "#fafafa",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.26)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "#fff3e0"
    }
    
  },

  bottomFlex: {
    padding: "30px 20px",
    marginTop: "20px",
    textAlign:"center",
    borderTop: "2px solid black",
    backgroundColor:"#f2f4ede3"
  },

  entriesGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center"
  },

  card: {
    border: "2px solid #ddd",
    padding: "20px",
    width: "250px",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
    border:"5px solid black",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "150%",
    backgroundPosition: "center",
    transition: "transform 0.2s ease",
    
  },

  entryEmoji: {
    fontSize: "50px",
    margin: "10px 0"
  },

  label2:{
  textAlign:"center",
  fontSize:"50px"
  },

  entryDate: {
    fontSize: "16px",
    color: "#555",
    margin: "10px 0"
  },

  deleteButton: {
    marginTop: "15px",
    padding: "8px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease"
  },

  noEntries: {
    textAlign: "center",
    color: "#999",
    fontSize: "18px",
    marginTop: "20px"
  }

};

export default App;
