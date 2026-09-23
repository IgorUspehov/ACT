import { cpa, roas } from "@/lib/metrics.ts"

export type CampaignStatus = "Active" | "Paused" | "Learning" | "Limited"

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  spend: number
  installs: number
  purchases: number
  revenue: number
}

export type SearchSignal = "Scale" | "Keep" | "Negative" | "Test" | "Add keyword"

export type SearchTerm = {
  id: string
  term: string
  match: "Exact" | "Broad"
  campaign: string
  impressions: number
  installs: number
  purchases: number
  spend: number
  signal: SearchSignal
}

export type DecisionStatus = "Applied" | "Pending" | "Recommended" | "Rejected"

export type Decision = {
  id: string
  title: string
  detail: string
  metric: string
  metricLabel: string
  status: DecisionStatus
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

export const reportingWindow = "Sep 16–22, 2026"

export const campaigns: Campaign[] = [
  {
    id: "brand-exact",
    name: "Brand — Exact",
    status: "Active",
    spend: 12480,
    installs: 4210,
    purchases: 812,
    revenue: 42180,
  },
  {
    id: "competitor-exact",
    name: "Competitor — Exact",
    status: "Active",
    spend: 8940,
    installs: 1860,
    purchases: 241,
    revenue: 12640,
  },
  {
    id: "generic-broad",
    name: "Generic — Broad",
    status: "Limited",
    spend: 9220,
    installs: 2140,
    purchases: 168,
    revenue: 7890,
  },
  {
    id: "discovery-search",
    name: "Discovery — Search",
    status: "Learning",
    spend: 6410,
    installs: 1980,
    purchases: 204,
    revenue: 11250,
  },
  {
    id: "retarget",
    name: "Retarget — Remarketing",
    status: "Active",
    spend: 7150,
    installs: 1620,
    purchases: 312,
    revenue: 16480,
  },
  {
    id: "seasonal",
    name: "Seasonal — Promo",
    status: "Paused",
    spend: 4120,
    installs: 676,
    purchases: 105,
    revenue: 5970,
  },
]

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

const totals = totalsOf(campaigns)

export type KpiFormat = "money" | "moneyExact" | "number" | "roas"
export type KpiDirection = "up" | "down" | "neutral"

export type Kpi = {
  id: "spend" | "installs" | "purchases" | "revenue" | "cpa" | "roas"
  label: string
  value: number
  format: KpiFormat
  delta: number
  goodWhen: KpiDirection
  series: number[]
}

export const kpis: Kpi[] = [
  {
    id: "spend",
    label: "Spend",
    value: totals.spend,
    format: "money",
    delta: 8.2,
    goodWhen: "neutral",
    series: [5200, 6100, 5800, 7400, 6900, 8100, 8820],
  },
  {
    id: "installs",
    label: "Installs",
    value: totals.installs,
    format: "number",
    delta: 14.6,
    goodWhen: "up",
    series: [1343, 1576, 1498, 1912, 1783, 2093, 2281],
  },
  {
    id: "purchases",
    label: "Purchases",
    value: totals.purchases,
    format: "number",
    delta: 6.1,
    goodWhen: "up",
    series: [176, 214, 210, 280, 268, 326, 368],
  },
  {
    id: "revenue",
    label: "Revenue",
    value: totals.revenue,
    format: "money",
    delta: 11.3,
    goodWhen: "up",
    series: [9212, 11201, 10991, 14655, 14027, 17063, 19261],
  },
  {
    id: "cpa",
    label: "CPA",
    value: cpa(totals.spend, totals.purchases) ?? 0,
    format: "moneyExact",
    delta: -4.8,
    goodWhen: "down",
    series: [29.55, 28.5, 27.62, 26.43, 25.75, 24.85, 23.97],
  },
  {
    id: "roas",
    label: "ROAS",
    value: roas(totals.revenue, totals.spend) ?? 0,
    format: "roas",
    delta: 6.4,
    goodWhen: "up",
    series: [1.77, 1.84, 1.9, 1.98, 2.03, 2.11, 2.18],
  },
]

export const searchTerms: SearchTerm[] = [
  {
    id: "act-dashboard",
    term: "act dashboard",
    match: "Exact",
    campaign: "Brand — Exact",
    impressions: 48200,
    installs: 1820,
    purchases: 640,
    spend: 4210,
    signal: "Scale",
  },
  {
    id: "act-analytics",
    term: "act analytics",
    match: "Exact",
    campaign: "Brand — Exact",
    impressions: 12400,
    installs: 310,
    purchases: 118,
    spend: 980,
    signal: "Keep",
  },
  {
    id: "act-pricing",
    term: "act pricing",
    match: "Broad",
    campaign: "Discovery — Search",
    impressions: 6400,
    installs: 210,
    purchases: 96,
    spend: 394,
    signal: "Add keyword",
  },
  {
    id: "marketing-automation",
    term: "marketing automation",
    match: "Broad",
    campaign: "Generic — Broad",
    impressions: 86500,
    installs: 190,
    purchases: 22,
    spend: 3640,
    signal: "Negative",
  },
  {
    id: "free-act",
    term: "free act",
    match: "Broad",
    campaign: "Generic — Broad",
    impressions: 22100,
    installs: 80,
    purchases: 0,
    spend: 740,
    signal: "Negative",
  },
  {
    id: "competitor-alternative",
    term: "competitor alternative",
    match: "Exact",
    campaign: "Competitor — Exact",
    impressions: 21300,
    installs: 96,
    purchases: 28,
    spend: 1720,
    signal: "Test",
  },
  {
    id: "app-install-tracker",
    term: "app install tracker",
    match: "Broad",
    campaign: "Discovery — Search",
    impressions: 33100,
    installs: 240,
    purchases: 41,
    spend: 1480,
    signal: "Keep",
  },
  {
    id: "act-jobs",
    term: "act jobs",
    match: "Broad",
    campaign: "Generic — Broad",
    impressions: 15400,
    installs: 40,
    purchases: 0,
    spend: 510,
    signal: "Negative",
  },
]

export const decisions: Decision[] = [
  {
    id: "scale-brand",
    title: "Increase budget on Brand — Exact by 20%",
    detail:
      "ROAS is 3.38x and CPA is $15.37. Exact match still has room before the target CPA.",
    metric: "3.38x",
    metricLabel: "ROAS",
    status: "Applied",
    time: "Sep 23, 09:14",
  },
  {
    id: "negatives",
    title: "Add negatives on Generic — Broad",
    detail:
      "Queries “free act” and “act jobs” spent $1,250 with no purchases. Exclude them from the broad set.",
    metric: "$54.88",
    metricLabel: "CPA",
    status: "Pending",
    time: "Sep 23, 08:02",
  },
  {
    id: "hold-discovery",
    title: "Hold Discovery — Search through learning",
    detail:
      "The match-type test is on day 6 of 14. Volume is enough to finish the read before changing bids.",
    metric: "6 / 14",
    metricLabel: "Day",
    status: "Recommended",
    time: "Sep 22, 18:40",
  },
  {
    id: "reject-generic-bid",
    title: "Reject a bid increase on Generic — Broad",
    detail:
      "ROAS is 0.86x, under the 1.20x floor. A higher bid would scale unprofitable traffic.",
    metric: "0.86x",
    metricLabel: "ROAS",
    status: "Rejected",
    time: "Sep 22, 16:05",
  },
]

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
