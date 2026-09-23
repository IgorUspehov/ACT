from pathlib import Path
import sqlite3

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "input" / "demo.csv"
DB_PATH = ROOT / "data" / "database" / "act.db"

REQUIRED_COLUMNS = [
    "date",
    "source",
    "campaign",
    "ad_group",
    "search_term",
    "impressions",
    "clicks",
    "installs",
    "spend",
    "purchases",
    "revenue",
    "status",
]


def ingest() -> int:
    frame = pd.read_csv(CSV_PATH)
    missing = [column for column in REQUIRED_COLUMNS if column not in frame.columns]
    if missing:
        raise ValueError(f"Missing columns: {', '.join(missing)}")
    if not frame["status"].eq("DEMO").all():
        raise ValueError("All rows must have status=DEMO")

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as connection:
        frame.to_sql("daily_stats", connection, if_exists="replace", index=False)

    loaded = len(frame)
    print(loaded)
    return loaded


if __name__ == "__main__":
    ingest()
