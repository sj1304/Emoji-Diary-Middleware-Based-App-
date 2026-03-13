require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ================= SCHEMA =================

const diarySchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  date: { type: String, required: true }
});

const Diary = mongoose.model("Diary", diarySchema);


// ================= VALIDATION =================

const validateEntry = (req, res, next) => {
  const { emoji, date } = req.body;

  if (!emoji || !date) {
    return res.status(400).json({ message: "Emoji and Day required" });
  }

  next();
};


// ================= ROUTES =================


// Add Entry
app.post("/add", validateEntry, async (req, res) => {
  try {

    const { emoji, date } = req.body;

    const newEntry = new Diary({
      emoji,
      date
    });

    await newEntry.save();

    res.json({ message: "Entry Added Successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to add entry" });
  }
});


// Get Entries
app.get("/entries", async (req, res) => {
  try {

    const entries = await Diary.find().sort({ _id: -1 });

    res.json(entries);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});


// Delete Entry
app.delete("/delete/:id", async (req, res) => {
  try {

    await Diary.findByIdAndDelete(req.params.id);

    res.json({ message: "Entry Deleted" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
