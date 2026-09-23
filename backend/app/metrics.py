import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "database" / "act.db"


def get_campaign_metrics():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("""
        SELECT
            campaign,
            SUM(impressions) AS impressions,
            SUM(clicks) AS clicks,
            SUM(installs) AS installs,
            SUM(spend) AS spend,
            SUM(purchases) AS purchases,
            SUM(revenue) AS revenue
        FROM daily_stats
        GROUP BY campaign
        ORDER BY campaign
    """).fetchall()
    conn.close()
    result = []
    for row in rows:
        spend = row["spend"] or 0
        purchases = row["purchases"] or 0
        clicks = row["clicks"] or 0
        result.append({
            "campaign": row["campaign"],
            "impressions": row["impressions"],
            "clicks": clicks,
            "installs": row["installs"],
            "spend": round(spend, 2),
            "purchases": purchases,
            "revenue": round(row["revenue"] or 0, 2),
            "ctr": round(clicks / row["impressions"] * 100, 2)
                if row["impressions"] else 0,
            "cpa": round(spend / purchases, 2)
                if purchases else None,
        })
    return result


if __name__ == "__main__":
    for item in get_campaign_metrics():
        print(item)
