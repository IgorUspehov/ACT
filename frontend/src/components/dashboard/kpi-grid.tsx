import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  DollarSign,
  ShoppingBag,
  Smartphone,
  Target,
  TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { kpis, reportingWindow, type Kpi } from "@/data/demo"
import { fill, useI18n } from "@/i18n"
import { formatMoney, formatNumber, formatPercent, formatRoas } from "@/lib/format"
import { cn } from "@/lib/utils"

const presentation: Record<
  Kpi["id"],
  { icon: LucideIcon; tile: string; stroke: string }
> = {
  spend: {
    icon: DollarSign,
    tile: "bg-primary text-primary-foreground",
    stroke: "#C89600",
  },
  installs: {
    icon: Smartphone,
    tile: "bg-blue-50 text-blue-600",
    stroke: "#2563EB",
  },
  purchases: {
    icon: ShoppingBag,
    tile: "bg-blue-50 text-blue-700",
    stroke: "#1D4ED8",
  },
  revenue: {
    icon: CircleDollarSign,
    tile: "bg-green-50 text-green-700",
    stroke: "#16A34A",
  },
  cpa: {
    icon: Target,
    tile: "bg-red-50 text-red-600",
    stroke: "#E11D48",
  },
  roas: {
    icon: TrendingUp,
    tile: "bg-green-50 text-green-700",
    stroke: "#16A34A",
  },
}

function formatKpi(kpi: Kpi) {
  if (kpi.format === "money") return formatMoney(kpi.value)
  if (kpi.format === "moneyExact") return formatMoney(kpi.value, 2)
  if (kpi.format === "roas") return formatRoas(kpi.value)
  return formatNumber(kpi.value)
}

function deltaTone(kpi: Kpi) {
  if (kpi.goodWhen === "neutral" || kpi.delta === 0) return "text-muted-foreground"
  const improved = kpi.goodWhen === "up" ? kpi.delta > 0 : kpi.delta < 0
  return improved ? "text-green-700" : "text-red-600"
}

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  const width = 120
  const height = 32
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - 3 - ((value - min) / span) * (height - 8)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-8 w-full" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KpiGrid() {
  const { messages } = useI18n()

  return (
    <section id="overview" className="scroll-mt-28 space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">{messages.overview.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {fill(messages.overview.subtitle, { window: reportingWindow })}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-6">
        {kpis.map((kpi) => {
          const meta = presentation[kpi.id]
          const Icon = meta.icon
          const DeltaIcon = kpi.delta >= 0 ? ArrowUpRight : ArrowDownRight

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
                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className={cn("inline-flex items-center font-medium", deltaTone(kpi))}>
                    <DeltaIcon className="size-3.5" />
                    {formatPercent(kpi.delta)}
                  </span>
                  <span className="text-muted-foreground">{messages.overview.vsPrior}</span>
                </p>
                <Sparkline data={kpi.series} stroke={meta.stroke} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
