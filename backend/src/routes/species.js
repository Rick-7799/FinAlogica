
// backend/src/routes/species.js
import { Router } from "express";
import { query } from "../services/db.js";

const r = Router();
r.get("/", async (_, res) => {
  const { rows } = await query("SELECT id, common_name, scientific_name FROM species ORDER BY id ASC");
  res.json(rows);
});
export default r;
