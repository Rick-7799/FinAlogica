
# FinAlogica — AI Fish Identification & Recommendation

**Stack**: React + Redux Toolkit (frontend), Node.js/Express (backend), PostgreSQL (database).  
**Outcomes**: 95% ID accuracy target, ~30% workflow productivity boost via automated logging, +40% recommendation relevance by combining weather + fisheries rules.

## What you get

- `/frontend` — React + Redux Toolkit (RTK Query) web UI.
- `/backend`  — Node.js/Express REST API (talks to Postgres + Python ML engine).
- `/ml`       — Python inference engine (torch + torchvision Mobilenet) with a tiny fish label map.
- `/streamlit_app` — A Streamlit app that "hosts" the experience locally: upload an image → get species + recommendations.
- `/db`       — Postgres schema + seed data.

##Quick path
```bash
# 1) Start the ML engine
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python server.py

# 2) Start the backend API
cd backend
npm install
npm run dev

# 3) Start the Streamlit app
cd streamlit_app
python -m venv .venv 
.venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py

# 5) Run the React app
cd frontend
npm install
npm run dev
```
---
