import {
  CircleDollarSign,
  DollarSign,
  ShoppingBag,
  Smartphone,
  Target,
  TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { totalsOf, type Campaign, type Kpi } from "@/data/demo"
import { useI18n } from "@/i18n"
import { formatMoney, formatNumber, formatRoas } from "@/lib/format"
import type { Resource } from "@/lib/api"
import { cpa, roas } from "@/lib/metrics"
import { cn } from "@/lib/utils"

const presentation: Record<Kpi["id"], { icon: LucideIcon; tile: string }> = {
  spend: {
    icon: DollarSign,
    tile: "bg-primary text-primary-foreground",
  },
  installs: {
    icon: Smartphone,
    tile: "bg-blue-50 text-blue-600",
  },
  purchases: {
    icon: ShoppingBag,
    tile: "bg-blue-50 text-blue-700",
  },
  revenue: {
    icon: CircleDollarSign,
    tile: "bg-green-50 text-green-700",
  },
  cpa: {
    icon: Target,
    tile: "bg-red-50 text-red-600",
  },
  roas: {
    icon: TrendingUp,
    tile: "bg-green-50 text-green-700",
  },
}

function formatKpi(kpi: Kpi) {
  if (kpi.format === "money") return formatMoney(kpi.value)
  if (kpi.format === "moneyExact") return formatMoney(kpi.value, 2)
  if (kpi.format === "roas") return formatRoas(kpi.value)
  return formatNumber(kpi.value)
}

function kpisFromCampaigns(campaigns: Campaign[]): Kpi[] {
  const totals = totalsOf(campaigns)
  return [
    { id: "spend", value: totals.spend, format: "moneyExact" },
    { id: "installs", value: totals.installs, format: "number" },
    { id: "purchases", value: totals.purchases, format: "number" },
    { id: "revenue", value: totals.revenue, format: "moneyExact" },
    { id: "cpa", value: cpa(totals.spend, totals.purchases) ?? 0, format: "moneyExact" },
    { id: "roas", value: roas(totals.revenue, totals.spend) ?? 0, format: "roas" },
  ]
}

export function KpiGrid({ campaigns }: { campaigns: Resource<Campaign[]> }) {
  const { messages } = useI18n()
  const kpis = campaigns.status === "ready" ? kpisFromCampaigns(campaigns.data) : []

  return (
    <section id="overview" className="scroll-mt-28 space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">{messages.overview.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{messages.overview.subtitle}</p>
      </header>

      {campaigns.status !== "ready" ? (
        <p
          className={campaigns.status === "error" ? "text-sm text-red-600" : "text-sm text-muted-foreground"}
          role="status"
        >
          {campaigns.status === "error" ? messages.feedback.error : messages.feedback.loading}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-6">
          {kpis.map((kpi) => {
            const meta = presentation[kpi.id]
            const Icon = meta.icon

            return (
              <Card key={kpi.id} className="gap-0 py-4">
                <CardContent className="px-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {messages.kpi[kpi.id]}
                    </p>
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        meta.tile,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                    {formatKpi(kpi)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
