import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectRedis } from "./db/db.js";
import pastebinRoutes from "./routes/pastebinRoutes.js";

dotenv.config();

const app = express();

/* ✅ CORS MUST BE FIRST */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const redis = await connectRedis();

app.use((req, res, next) => {
  req.redis = redis;
  next();
});

app.use("/api", pastebinRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Pastebin server");
});

export default app;   // 👈 important for Vercel
