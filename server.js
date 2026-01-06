import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./dbcon/db.js";
import mainRouter from "./routes/index.js";

dotenv.config();

const app = express();

// ✅ Required for Render (secure cookies + proxy)
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE (ORDER MATTERS)
// ======================

// 1️⃣ Parse cookies first
app.use(cookieParser());

// 2️⃣ CORS (must allow credentials)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://swiggy-clone-murex-eta.vercel.app",
    ],
    credentials: true,
  })
);

// 3️⃣ Parse JSON
app.use(express.json());

// ======================
// ROUTES
// ======================
app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// ======================
// START SERVER
// ======================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
