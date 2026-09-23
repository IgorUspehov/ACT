import yaml
from pathlib import Path

from app.classifier import classify_campaigns

BASE_DIR = Path(__file__).resolve().parent.parent
MANIFEST_PATH = BASE_DIR / "config" / "manifest.yml"


def load_manifest():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def make_decisions():
    manifest = load_manifest()
    rules = manifest["decision_rules"]
    campaigns = classify_campaigns()
    decisions = []
    for campaign in campaigns:
        purchases = campaign["purchases"]
        cpa = campaign["cpa"]
        target_cpa = manifest["economics"]["target_cpa"]
        if purchases == 0:
            decision = "INSUFFICIENT_DATA"
        elif purchases >= rules["scale"]["min_purchases"] and cpa <= target_cpa * rules["scale"]["max_cpa_ratio"]:
            decision = "SCALE"
        elif cpa <= target_cpa * rules["promising"]["max_cpa_ratio"]:
            decision = "PROMISING"
        elif purchases == rules["kill"]["purchases"] and cpa is None:
            decision = "KILL"
        else:
            decision = "HOLD"
        decisions.append({
            **campaign,
            "decision": decision,
        })
    return decisions


if __name__ == "__main__":
    for item in make_decisions():
        print(item)
