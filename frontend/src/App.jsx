import React, { useState, useMemo } from 'react'
import { useListSpeciesQuery, usePredictMutation, useRecommendQuery } from './app/services.js'

const card = {
  background: '#fff',
  border: '1px solid #eaeaea',
  borderRadius: '14px',
  padding: '18px',
  boxShadow: '0 4px 18px rgba(0,0,0,0.06)'
}
const btn = {
  padding: '10px 16px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  cursor: 'pointer',
  fontWeight: 600
}
const btnPrimary = { ...btn, background: '#2563eb', color: '#fff', border: '1px solid #1d4ed8' }
const inputBox = { padding: '10px 12px', borderRadius: '10px', border: '1px solid #ddd', width: '100%' }

export default function App() {
  const { data: species = [], isLoading: loadingSpecies } = useListSpeciesQuery()
  const [predict, { data: pred, isLoading: loadingPredict, error: predErr }] = usePredictMutation()

  const [file, setFile] = useState(null)
  const [lat, setLat] = useState(23.25)
  const [lon, setLon] = useState(77.41)

  const top = pred?.predictions?.[0]?.label || null
  const { data: rec, isFetching: loadingRec, error: recErr, refetch } =
    useRecommendQuery({ lat, lon, species: top ?? 'tench' }, { skip: !top })

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  const handlePredict = async () => {
    if (!file) return
    try {
      await predict(file).unwrap()
    } catch (e) {
      // handled by RTK Query error state as well
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fb', padding: '24px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', fontFamily: 'Inter, system-ui, Arial' }}>
        <header style={{ margin: '10px 0 24px' }}>
          <h1 style={{ margin: 0, fontSize: 30 }}>🐟 FinAlogica</h1>
          <div style={{ color: '#6b7280' }}>AI fish ID + weather-aware recommendations</div>
        </header>

        {/* Upload & Predict */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>1) Upload image & Predict</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ marginBottom: 10 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ ...inputBox, padding: 8 }}
                />
              </div>
              <button
                style={file ? btnPrimary : { ...btnPrimary, opacity: 0.5, cursor: 'not-allowed' }}
                disabled={!file || loadingPredict}
                onClick={handlePredict}
              >
                {loadingPredict ? 'Predicting…' : 'Predict'}
              </button>

              {predErr && (
                <div style={{ marginTop: 10, color: '#b91c1c' }}>
                  Prediction failed. Open DevTools → Console/Network for details.
                </div>
              )}
            </div>

            <div>
              <div style={{ ...card, padding: 12, background: '#fafafa' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Preview</div>
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                ) : (
                  <div style={{ color: '#6b7280' }}>No image selected.</div>
                )}
              </div>
            </div>
          </div>

          {pred && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Prediction</div>
              <div style={{ ...card, background: '#0b1324', color: '#e2e8f0', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}>{JSON.stringify(pred, null, 2)}</pre>
              </div>
              <div style={{ marginTop: 8 }}>
                Top species: <strong>{top}</strong>
              </div>
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>2) Location → Recommendations</h3>
          {!top && (
            <div style={{ color: '#6b7280', marginBottom: 8 }}>
              Upload & predict first to enable recommendations.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value || '0'))}
                style={inputBox}
                disabled={!top}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value || '0'))}
                style={inputBox}
                disabled={!top}
              />
            </div>
          </div>

          <button
            style={top ? btnPrimary : { ...btnPrimary, opacity: 0.5, cursor: 'not-allowed' }}
            disabled={!top || loadingRec}
            onClick={() => refetch()}
          >
            {loadingRec ? 'Getting recommendations…' : 'Get recommendations'}
          </button>

          {recErr && (
            <div style={{ marginTop: 10, color: '#b91c1c' }}>
              Recommendation failed. Backend might be down or ML not running.
            </div>
          )}

          {rec && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Recommendations</div>
              <div style={{ ...card, background: '#0b1324', color: '#e2e8f0', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}>{JSON.stringify(rec, null, 2)}</pre>
              </div>
            </div>
          )}
        </section>

        {/* Species catalog */}
        <section style={{ ...card }}>
          <h3 style={{ marginTop: 0 }}>Species Catalog</h3>
          {loadingSpecies ? (
            <div>Loading species…</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {species.map(s => (
                <li key={s.id}>
                  {s.common_name} <span style={{ color: '#6b7280' }}>({s.scientific_name})</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', marginTop: 18 }}>
          API: http://localhost:4000/api &nbsp;|&nbsp; ML: http://localhost:8001
        </footer>
      </div>
    </div>
  )
}
