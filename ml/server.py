

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io, json, torch, torchvision.transforms as T
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights

app = FastAPI(title="FinAlogica ML Engine", version="1.0.0")

with open("fish_labels.json", "r") as f:
    FISH_MAP = json.load(f)

weights = MobileNet_V3_Small_Weights.DEFAULT
model = mobilenet_v3_small(weights=weights)
model.eval()
preprocess = weights.transforms()


idx_to_label = weights.meta["categories"]
cat_to_idx = {c: i for i, c in enumerate(idx_to_label)}


fish_to_indices = {}
for fish_key, names in FISH_MAP.items():
    inds = [cat_to_idx[n] for n in names if n in cat_to_idx]
    if inds:
        fish_to_indices[fish_key] = inds

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    raw = await file.read()
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    x = preprocess(img).unsqueeze(0)  

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).squeeze(0)  

  
    scored = []
    for fish_key, inds in fish_to_indices.items():
        score = float(probs[inds].sum().item())
        scored.append((fish_key, score))

    scored.sort(key=lambda z: z[1], reverse=True)
    top = [{"label": k, "score": s} for k, s in scored[:3]]

    return JSONResponse({"predictions": top})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
