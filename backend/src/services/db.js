
// backend/src/services/db.js
import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const query = (text, params) => pool.query(text, params);
