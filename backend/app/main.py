from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "environment": "DEMO"}


@app.get("/api/campaigns")
def campaigns():
    from metrics import get_campaign_metrics
    return {"campaigns": get_campaign_metrics()}


@app.get("/api/search-terms")
def search_terms():
    return {"search_terms": []}


@app.get("/api/decisions")
def decisions():
    return {"decisions": []}
