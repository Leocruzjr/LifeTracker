// index.js  --- ES Module version
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables (if you create a .env file later)
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  credentials: false
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is alive!");
});

// Health check API
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong", time: new Date().toISOString() });
});


// Port (use .env PORT if available)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
