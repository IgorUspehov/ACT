from decision_engine import make_decisions


def generate_report():
    decisions = make_decisions()
    return {
        "environment": "DEMO",
        "campaigns": decisions,
    }


if __name__ == "__main__":
    report = generate_report()
    for campaign in report["campaigns"]:
        print(
            f'{campaign["campaign"]}: '
            f'{campaign["decision"]}'
        )
