
# FinAlogica — AI Fish Identification & Recommendation (Local)

**Stack**: React + Redux Toolkit (frontend), Node.js/Express (backend), PostgreSQL (database), Python (ML), Streamlit (local host/demo UI).  
**Claimed outcomes** (demo-ready): 95% ID accuracy target (with a MobileNet baseline), ~30% workflow productivity boost via automated logging, +40% recommendation relevance by combining weather + fisheries rules.

This is a local, portable demo you can run on your machine (no mobile app).

## What you get

- `/frontend` — React + Redux Toolkit (RTK Query) web UI.
- `/backend`  — Node.js/Express REST API (talks to Postgres + Python ML engine).
- `/ml`       — Python inference engine (torch + torchvision Mobilenet) with a tiny fish label map.
- `/streamlit_app` — A Streamlit app that "hosts" the experience locally: upload an image → get species + recommendations.
- `/db`       — Postgres schema + seed data.
- `.env.example` files for each piece.

## One-shot local setup (quick path)
If you already have **Python 3.10+**, **Node 18+**, and **PostgreSQL 14+** installed:

```bash
# 0) Open ONE terminal and run Postgres (or ensure it's running). Create a DB user & DB:
#    Replace password if you like.
psql -U postgres -c "CREATE USER finalogica WITH PASSWORD 'finalogica123';" || true
psql -U postgres -c "CREATE DATABASE finalogica OWNER finalogica;" || true

# 1) Apply schema + seed
psql -U postgres -d finalogica -f db/schema.sql
psql -U postgres -d finalogica -f db/seed.sql

# 2) Start the ML engine (first run downloads weights ~5-20s depending on net)
cd ml
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python server.py

# 3) Start the backend API (in a NEW terminal)
cd backend
cp .env.example .env
npm install
npm run dev

# 4) Start the Streamlit app (in a NEW terminal) — this is your local "host" UI
cd streamlit_app
cp .env.example .env
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py

# 5) (Optional) Run the React app too (full web UI)
cd frontend
cp .env.example .env
npm install
npm start
```

Streamlit will open at `http://localhost:8501`.  
Backend API runs at `http://localhost:4000`.  
ML engine runs at `http://localhost:8001`.  
React dev server runs at `http://localhost:5173` (Vite).

> If you prefer just **one UI**, use only the Streamlit app (Step 4). It calls the same backend/ML services.

---

## Baby-steps (like you're 5 🤗)

1. **We need a fish house (database).** We build it with bricks (PostgreSQL). Run the two `psql` commands above to make a new room called `finalogica` and give our friend `finalogica` a key (password).
2. **We put furniture inside** (tables): run the two `.sql` files to create tables and put some example fish inside.
3. **We wake up the fish brain** (ML engine): go into the `ml` folder, install the brain's food (`requirements.txt`), and run `server.py`. First time, it downloads a brain (MobileNet weights).
4. **We open the fish desk** (backend API): go to `backend`, install packages, and run it. This desk talks to the fish brain and the fish house.
5. **We open a pretty window** (Streamlit): go to `streamlit_app` and run it. Click! Upload a fish picture and see the magic.
6. **Extra toys** (React app): if you want a richer site, start the React app too.

If anything says “port already used,” stop the old thing or change the port in the `.env` file.

---

## Accuracy/Relevance Notes
- Baseline model uses ImageNet MobileNet and a small fish label map. For 95%+ on your target dataset, fine-tune with your data (see `ml/train_notebook.ipynb`).
- Weather relevance (+40% target) is driven by combining temperature, wind, and time-of-day heuristics. See `backend/src/services/recommendation.ts` for rules; connect to live weather (Open-Meteo) by setting `OPEN_METEO=1` in `.env`.

---

## Project tree
```
FinAlogica/
  backend/
  db/
  frontend/
  ml/
  streamlit_app/
  README.md
```
