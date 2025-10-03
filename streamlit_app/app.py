# streamlit_app/app.py
import os, requests
from dotenv import load_dotenv
import streamlit as st

load_dotenv()
API = os.getenv("API_URL", "http://localhost:4000/api")

st.set_page_config(page_title="FinAlogica (Local)", layout="centered")
st.title("🐟 FinAlogica — Local Host (Streamlit)")

# --------- STATE ---------
if "pred" not in st.session_state:
    st.session_state.pred = None
if "top_species" not in st.session_state:
    st.session_state.top_species = "tench"
if "rec" not in st.session_state:
    st.session_state.rec = None
if "lat" not in st.session_state:
    st.session_state.lat = 23.25
if "lon" not in st.session_state:
    st.session_state.lon = 77.41

# --------- UPLOAD + PREDICT ---------
img = st.file_uploader("Upload a fish image", type=["jpg","jpeg","png"], key="uploader")

if st.button("Predict", key="btn_predict"):
    if not img:
        st.warning("Please choose an image first.")
    else:
        files = {"image": (img.name, img.getvalue(), img.type)}
        with st.spinner("Talking to the fish brain..."):
            r = requests.post(f"{API}/predict", files=files, timeout=60)
        if r.ok:
            data = r.json()
            st.session_state.pred = data
            st.session_state.top_species = (data.get("predictions") or [{}])[0].get("label", "tench")
            st.session_state.rec = None  # clear old recs when new image predicted
            st.success("Prediction complete!")
        else:
            st.error("Prediction service error")

# Show prediction if we have it (persists across reruns)
if st.session_state.pred:
    st.subheader("Prediction")
    st.json(st.session_state.pred)
    st.write(f"Top species: **{st.session_state.top_species}**")

    # --------- RECOMMENDATIONS (use a form so a single submit reruns predictably) ---------
    with st.form("rec_form"):
        c1, c2 = st.columns(2)
        with c1:
            st.session_state.lat = st.number_input("Latitude", value=float(st.session_state.lat), key="lat_input")
        with c2:
            st.session_state.lon = st.number_input("Longitude", value=float(st.session_state.lon), key="lon_input")

        submitted = st.form_submit_button("Get recommendations")
        if submitted:
            params = {
                "lat": st.session_state.lat,
                "lon": st.session_state.lon,
                "species": st.session_state.top_species
            }
            with st.spinner("Scoring conditions..."):
                rr = requests.get(f"{API}/recommend", params=params, timeout=30)
            if rr.ok:
                st.session_state.rec = rr.json()
                st.success("Recommendations ready!")
            else:
                st.error("Recommendation service error")

# Show last recommendations (persist)
if st.session_state.rec:
    st.subheader("Recommendations")
    st.json(st.session_state.rec)

st.caption("Backend API: http://localhost:4000/api  |  ML: http://localhost:8001")
