import { useEffect, useState } from "react"

import type { Campaign, CampaignStatus, Decision, DecisionStatus, SearchSignal, SearchTerm } from "@/data/demo"

const API_BASE = "https://act-backend-6n74.onrender.com"

const campaignStatuses = ["Active", "Paused", "Learning", "Limited"] as const
const decisionStatuses = ["Applied", "Pending", "Recommended", "Rejected"] as const
const matches = ["Exact", "Broad"] as const
const signals = ["Scale", "Keep", "Negative", "Test", "Add keyword"] as const

export type Resource<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: T }

export type DashboardData = {
  campaigns: Resource<Campaign[]>
  searchTerms: Resource<SearchTerm[]>
  decisions: Resource<Decision[]>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readList(payload: unknown, key: string) {
  if (!isRecord(payload) || !Array.isArray(payload[key])) return null
  if (!payload[key].every(isRecord)) return null
  return payload[key]
}

function text(row: Record<string, unknown>, key: string) {
  const value = row[key]
  return typeof value === "string" && value.trim().length > 0 ? value : null
}

function amount(row: Record<string, unknown>, key: string) {
  const value = row[key]
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  if (value === null) return null
  return allowed.includes(value as T) ? (value as T) : null
}

export function mapCampaigns(payload: unknown): Campaign[] | null {
  const rows = readList(payload, "campaigns")
  if (rows === null) return null
  return rows.flatMap((row) => {
    const name = text(row, "campaign") ?? text(row, "name")
    if (name === null) return []
    const status = oneOf(text(row, "status"), campaignStatuses) satisfies CampaignStatus | null
    return [
      {
        id: text(row, "id") ?? name,
        name,
        status,
        spend: amount(row, "spend"),
        installs: amount(row, "installs"),
        purchases: amount(row, "purchases"),
        revenue: amount(row, "revenue"),
      },
    ]
  })
}

export function mapSearchTerms(payload: unknown): SearchTerm[] | null {
  const rows = readList(payload, "search_terms")
  if (rows === null) return null
  return rows.flatMap((row, index) => {
    const term = text(row, "search_term") ?? text(row, "term")
    if (term === null) return []
    return [
      {
        id: text(row, "id") ?? `${term}-${index}`,
        term,
        match: oneOf(text(row, "match"), matches),
        campaign: text(row, "campaign") ?? "",
        impressions: amount(row, "impressions"),
        installs: amount(row, "installs"),
        purchases: amount(row, "purchases"),
        spend: amount(row, "spend"),
        signal: oneOf(text(row, "signal"), signals) satisfies SearchSignal | null,
      },
    ]
  })
}

export function mapDecisions(payload: unknown): Decision[] | null {
  const rows = readList(payload, "decisions")
  if (rows === null) return null
  return rows.flatMap((row, index) => {
    const campaign = text(row, "campaign")
    const decision = text(row, "decision")
    const title = text(row, "title") ?? (campaign && decision ? `${campaign}: ${decision}` : null)
    if (title === null) return []
    const status = oneOf(text(row, "status"), decisionStatuses) satisfies DecisionStatus | null
    const metric = text(row, "metric") ?? (typeof row.cpa === "number" ? row.cpa.toFixed(2) : decision ?? "")
    return [
      {
        id: text(row, "id") ?? `${title}-${index}`,
        title,
        detail: text(row, "detail") ?? "",
        metric,
        metricLabel: text(row, "metricLabel") ?? (typeof row.cpa === "number" ? "CPA" : ""),
        status,
        label: status ?? decision ?? text(row, "status") ?? "",
        time: text(row, "time") ?? "",
      },
    ]
  })
}

async function loadResource<T>(path: string, map: (payload: unknown) => T | null): Promise<Resource<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`)
    if (!response.ok) return { status: "error" }
    const data = map(await response.json())
    if (data === null) return { status: "error" }
    return { status: "ready", data }
  } catch {
    return { status: "error" }
  }
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    campaigns: { status: "loading" },
    searchTerms: { status: "loading" },
    decisions: { status: "loading" },
  })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      loadResource("/api/campaigns", mapCampaigns),
      loadResource("/api/search-terms", mapSearchTerms),
      loadResource("/api/decisions", mapDecisions),
    ]).then(([campaigns, searchTerms, decisions]) => {
      if (cancelled) return
      setData({ campaigns, searchTerms, decisions })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return data
}
