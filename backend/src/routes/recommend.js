
import { Router } from "express";
import { getRecommendation } from "../services/recommendation.js";

const r = Router();


r.get("/", async (req, res) => {
  const lat = parseFloat(req.query.lat ?? "0");
  const lon = parseFloat(req.query.lon ?? "0");
  const species = (req.query.species ?? "tench").toString();
  const data = await getRecommendation({ lat, lon, species });
  res.json(data);
});

export default r;
