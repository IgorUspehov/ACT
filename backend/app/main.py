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


from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "database" / "act.db"


@app.on_event("startup")
def initialize_demo_database():
    if not DB_PATH.exists():
        from app.ingest import ingest
        ingest()

@app.api_route("/", methods=["GET", "HEAD"])
@app.api_route("/api/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok", "environment": "DEMO"}


@app.get("/api/campaigns")
def campaigns():
    from app.metrics import get_campaign_metrics
    return {"campaigns": get_campaign_metrics()}


@app.get("/api/search-terms")
def search_terms():
    return {"search_terms": []}


@app.get("/api/decisions")
def decisions():
    return {"decisions": []}
