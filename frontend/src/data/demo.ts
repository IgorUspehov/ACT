export type CampaignStatus = "Active" | "Paused" | "Learning" | "Limited"

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus | null
  spend: number
  installs: number
  purchases: number
  revenue: number
}

export type SearchSignal = "Scale" | "Keep" | "Negative" | "Test" | "Add keyword"

export type SearchTerm = {
  id: string
  term: string
  match: "Exact" | "Broad" | null
  campaign: string
  impressions: number
  installs: number
  purchases: number
  spend: number
  signal: SearchSignal | null
}

export type DecisionStatus = "Applied" | "Pending" | "Recommended" | "Rejected"

export type Decision = {
  id: string
  title: string
  detail: string
  metric: string
  metricLabel: string
  status: DecisionStatus | null
  label: string
  time: string
}

export type ExperimentStageId = "TEST" | "MEASURE" | "DECISION" | "ACTION"

export type ExperimentItem = {
  id: string
  name: string
  detail: string
  meta: string
  progress?: number
  badge?: string
  badgeTone?: "success" | "warning" | "info" | "destructive"
}

export type ExperimentStage = {
  id: ExperimentStageId
  step: string
  summary: string
  items: ExperimentItem[]
}

export function totalsOf(rows: Campaign[]) {
  return rows.reduce(
    (acc, row) => ({
      spend: acc.spend + row.spend,
      installs: acc.installs + row.installs,
      purchases: acc.purchases + row.purchases,
      revenue: acc.revenue + row.revenue,
    }),
    { spend: 0, installs: 0, purchases: 0, revenue: 0 },
  )
}

export type KpiFormat = "money" | "moneyExact" | "number" | "roas"

export type Kpi = {
  id: "spend" | "installs" | "purchases" | "revenue" | "cpa" | "roas"
  value: number
  format: KpiFormat
}

export const experimentStages: ExperimentStage[] = [
  {
    id: "TEST",
    step: "01",
    summary: "Changes in a controlled test",
    items: [
      {
        id: "bid-test",
        name: "Competitor bid +15%",
        detail: "Exact match on Competitor — Exact",
        meta: "Started Sep 18",
        badge: "Running",
        badgeTone: "info",
      },
      {
        id: "creative-test",
        name: "Creative “Install in 30s”",
        detail: "New headline on Brand — Exact",
        meta: "Started Sep 20",
        badge: "Running",
        badgeTone: "info",
      },
    ],
  },
  {
    id: "MEASURE",
    step: "02",
    summary: "Results collecting against a window",
    items: [
      {
        id: "match-type",
        name: "Broad vs exact",
        detail: "Discovery — Search · installs +9%",
        meta: "Day 6 of 14",
        progress: 43,
      },
      {
        id: "cta-color",
        name: "Yellow CTA vs blue CTA",
        detail: "Brand — Exact · CTR +1.4 pp",
        meta: "Day 4 of 7",
        progress: 57,
      },
    ],
  },
  {
    id: "DECISION",
    step: "03",
    summary: "Ready for a go or stop call",
    items: [
      {
        id: "narrow-generic",
        name: "Narrow Generic — Broad",
        detail: "ROAS 0.86x is below the 1.20x floor",
        meta: "Ready for review",
        badge: "Stop",
        badgeTone: "destructive",
      },
      {
        id: "promote-pricing",
        name: "Promote “act pricing”",
        detail: "CPA $4.10 on high-intent traffic",
        meta: "Ready for review",
        badge: "Promote",
        badgeTone: "success",
      },
    ],
  },
  {
    id: "ACTION",
    step: "04",
    summary: "Applied or queued in the demo account",
    items: [
      {
        id: "brand-budget",
        name: "Brand budget +20%",
        detail: "Live on Brand — Exact",
        meta: "Applied Sep 21",
        badge: "Live",
        badgeTone: "success",
      },
      {
        id: "negative-batch",
        name: "Negative keyword batch",
        detail: "free act, act jobs · Generic — Broad",
        meta: "Queued Sep 23",
        badge: "Queued",
        badgeTone: "warning",
      },
    ],
  },
]
