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
// ⭐ Application Schema / Model
// ----------------------
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schemeId: { type: String, required: true },
  schemeName: { type: String, required: true },
  applicationId: { type: String, unique: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected", "Query Raised"] },
  dateApplied: { type: Date, default: Date.now },
  deadline: Date,
  remarks: String,
  query: String,
  category: String,
  documents: [String],
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

// ----------------------
// ⭐ Document Schema / Model
// ----------------------
const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentName: { type: String, required: true },
  documentType: { type: String, required: true },
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

// ----------------------
// ⭐ Schemes Data Import
// ----------------------
// IMPORTANT: Your schemes.js must export a FLAT ARRAY like:
// export const schemes = [ {id:1,...}, {id:2,...} ]
import { schemes } from "./data/schemes.js";

// ----------------------
// ⭐ Helper: Verify JWT Token
// ----------------------
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}


// ----------------------
// ⭐ API ROUTES
// ----------------------

/* ✔ Get All Schemes */
app.get("/api/schemes", (req, res) => {
  res.json(schemes); // return plain array (frontend expects array)
});

/* ✔ Signup Route */
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

/* ✔ Login Route */
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

/* ✔ Profile Route */
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
// ⭐ Applications Routes
// ----------------------

/* Get all applications for logged-in user */
app.get("/api/applications", verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

/* Create new application */
app.post("/api/applications", verifyToken, async (req, res) => {
  try {
    const { schemeId, schemeName, category } = req.body;

    if (!schemeId || !schemeName) {
      return res.status(400).json({ error: "Scheme ID and name required" });
    }

    // Generate unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const application = await Application.create({
      userId: req.userId,
      schemeId,
      schemeName,
      applicationId,
      category,
      status: "Pending",
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Application creation error:", err);
    res.status(500).json({ error: "Failed to create application" });
  }
});

/* Update application */
app.put("/api/applications/:id", verifyToken, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    Object.assign(application, req.body);
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

/* Delete application */
app.delete("/api/applications/:id", verifyToken, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// ----------------------
// ⭐ Documents Routes
// ----------------------

/* Get all documents for logged-in user */
app.get("/api/documents", verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId })
      .sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

/* Upload document */
app.post("/api/documents/upload", verifyToken, async (req, res) => {
  try {
    const { documentName, documentType, fileUrl } = req.body;

    if (!documentName || !documentType) {
      return res.status(400).json({ error: "Document name and type required" });
    }

    // In a real app, you'd handle file upload with multer
    // For now, we'll accept a fileUrl or store metadata
    const document = await Document.create({
      userId: req.userId,
      documentName,
      documentType,
      fileUrl: fileUrl || `https://example.com/files/${Date.now()}-${documentName}`,
    });

    res.status(201).json(document);
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

/* Delete document */
app.delete("/api/documents/:id", verifyToken, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// ----------------------
// ⭐ Start Server
// ----------------------
app.listen(5000, () => {
  console.log("✓ Backend running at http://localhost:5000");
});
