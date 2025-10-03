// backend/src/routes/predict.js
import { Router } from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const upload = multer();
const r = Router();

r.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded (field name must be 'image')." });
    }
    const mlUrl = process.env.ML_URL || "http://localhost:8001";

    // Build multipart/form-data for FastAPI (expects field name 'file')
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname || "upload.jpg",
      contentType: req.file.mimetype || "image/jpeg",
    });

    const resp = await axios.post(`${mlUrl}/predict`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    res.json(resp.data);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "ML service error" });
  }
});

export default r;
