// server.js
require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const connectDB  = require("./config/db");

const authRoutes     = require("./routes/authRoutes");
const outfitRoutes   = require("./routes/outfitRoutes");
const wardrobeRoutes = require("./routes/wardrobeRoutes");

connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173")
  .split(",").map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (_req, res) =>
  res.json({
    success: true,
    message: "Smart Styling Assistant API",
    version: "2.0.0",
    endpoints: {
      auth:     "/api/auth",
      outfits:  "/api/outfits",
      wardrobe: "/api/wardrobe",
    },
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/outfits",  outfitRoutes);
app.use("/api/wardrobe", wardrobeRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `${req.method} ${req.originalUrl} not found` })
);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

// ── Listen ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  Server running on port ${PORT}  [${process.env.NODE_ENV || "development"}]`);
  console.log(`📡  http://localhost:${PORT}/api\n`);
});

module.exports = app;