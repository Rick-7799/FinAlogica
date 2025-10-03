
// backend/src/services/recommendation.js
import axios from "axios";

function scoreByWeather({ tempC, windKph, hour }) {
  // Simple heuristic: mild temp and low wind are good; dawn/dusk bonus.
  let score = 0;
  if (tempC >= 15 && tempC <= 28) score += 0.5;
  if (windKph <= 12) score += 0.3;
  if (hour >= 5 && hour <= 8) score += 0.2;
  if (hour >= 17 && hour <= 19) score += 0.2;
  return Math.min(1, score);
}

export async function getRecommendation({ lat, lon, species }) {
  let weather = { tempC: 22, windKph: 8, hour: new Date().getHours(), source: "stub" };

  if (process.env.OPEN_METEO === "1") {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
      const { data } = await axios.get(url);
      const tempC = data?.current?.temperature_2m ?? 22;
      const windKph = (data?.current?.wind_speed_10m ?? 2.5) * 3.6; // m/s → km/h
      weather = { tempC, windKph, hour: new Date().getHours(), source: "open-meteo" };
    } catch (e) {
      // fallback stays
    }
  }

  const weatherScore = scoreByWeather(weather);
  const notes = `Based on temp ${weather.tempC}°C and wind ${weather.windKph.toFixed(1)} km/h.`;

  return {
    species,
    best_hours: ["06:00-08:00", "17:00-19:00"],
    bait_suggestion: species.includes("sturgeon") ? "Worms & shrimp" : "Corn & pellets",
    weather,
    relevance_score: Number((weatherScore * 0.9 + 0.1).toFixed(2)),
    notes
  };
}
