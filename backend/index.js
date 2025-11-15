import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// ⭐ MongoDB Atlas Setup
// ----------------------
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env file");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✓ Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("❌ MongoDB Atlas connection error:", err);
      console.log("⚠️ Backend will continue running WITHOUT DB.");
    });
}

// ----------------------
// ⭐ User Schema / Model
// ----------------------
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  fullName: String,
  email: String,
  phone: String,
  age: String,
  gender: String,
  state: String,
  category: String,
  income: String,
  education: String,
  employment: String,
});

const User = mongoose.model("User", userSchema);

// ----------------------
// ⭐ Schemes Data Import
// ----------------------
import { schemes } from "./data/schemes.js";

// ----------------------
// ⭐ API ROUTES
// ----------------------

// Get all schemes
app.get("/api/schemes", (req, res) => {
  res.json({ schemes });
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  const {
    username,
    password,
    fullName,
    email,
    phone,
    age,
    gender,
    state,
    category,
    income,
    education,
    employment,
  } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hash,
      fullName,
      email,
      phone,
      age,
      gender,
      state,
      category,
      income,
      education,
      employment,
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

// ----------------------
// ⭐ Profile Route
// ----------------------
app.get("/api/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret"
    );

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// ----------------------
// ⭐ Start Server
// ----------------------
app.listen(5000, () => {
  console.log("✓ Backend running at http://localhost:5000");
});
