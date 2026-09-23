from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BACKEND_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = BACKEND_ROOT / "data" / "database" / "act.db"
FRONTEND_CANDIDATES = (
    BACKEND_ROOT.parent / "frontend" / "dist",
    BACKEND_ROOT / "static",
)


@app.on_event("startup")
def initialize_demo_database():
    if not DB_PATH.exists():
        from app.ingest import ingest
        ingest()


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


def _frontend_dist() -> Path | None:
    for candidate in FRONTEND_CANDIDATES:
        if (candidate / "index.html").is_file():
            return candidate
    return None


def _frontend_file(relative_path: str) -> Path | None:
    root = _frontend_dist()
    if root is None or not relative_path or relative_path.endswith("/"):
        return None
    root = root.resolve()
    candidate = (root / relative_path).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        return None
    if candidate.is_file():
        return candidate
    return None


@app.api_route("/", methods=["GET", "HEAD"])
@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
def frontend(full_path: str = ""):
    if full_path == "api" or full_path.startswith("api/"):
        raise HTTPException(status_code=404)

    if full_path:
        asset = _frontend_file(full_path)
        if asset is not None:
            return FileResponse(asset)
        if "." in Path(full_path).name:
            raise HTTPException(status_code=404)

    dist = _frontend_dist()
    index = dist / "index.html" if dist is not None else None
    if index is not None and index.is_file():
        return FileResponse(index)
    raise HTTPException(status_code=503, detail="Frontend is not built")
