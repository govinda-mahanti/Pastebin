import express from "express";
import { healthCheck, createPaste, getPaste } from "../controllers/pastebinControllers.js";

const router = express.Router();

router.get("/healthz", healthCheck);
router.post("/paste", createPaste);
router.get("/paste/:id", getPaste);

export default router;
