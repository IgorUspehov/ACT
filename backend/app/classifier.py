from metrics import get_campaign_metrics


def classify_campaigns():
    campaigns = get_campaign_metrics()
    result = []
    for campaign in campaigns:
        if campaign["purchases"] == 0:
            status = "NO_PURCHASES"
        elif campaign["cpa"] is not None:
            status = "HAS_PURCHASES"
        else:
            status = "UNKNOWN"
        result.append({
            **campaign,
            "classification": status,
        })
    return result


if __name__ == "__main__":
    for item in classify_campaigns():
        print(item)
