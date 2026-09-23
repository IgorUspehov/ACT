import { CircleCheck, CircleX, Clock, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { decisions, type DecisionStatus } from "@/data/demo"
import { fill, useI18n } from "@/i18n"
import type { Messages } from "@/i18n/types"

const statusPresentation: Record<
  DecisionStatus,
  {
    variant: "success" | "warning" | "info" | "destructive"
    bar: string
    icon: LucideIcon
  }
> = {
  Applied: {
    variant: "success",
    bar: "bg-green-600",
    icon: CircleCheck,
  },
  Pending: {
    variant: "warning",
    bar: "bg-primary",
    icon: Clock,
  },
  Recommended: {
    variant: "info",
    bar: "bg-blue-600",
    icon: Sparkles,
  },
  Rejected: {
    variant: "destructive",
    bar: "bg-red-600",
    icon: CircleX,
  },
}

function metricLabel(label: string, messages: Messages) {
  if (label === "Day") return messages.decisions.day
  if (label === "CPA") return messages.kpi.cpa
  if (label === "ROAS") return messages.kpi.roas
  return label
}

export function DecisionsPanel() {
  const { messages } = useI18n()

  return (
    <section id="decisions" className="scroll-mt-28 space-y-4">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{messages.decisions.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {fill(messages.decisions.summary, { count: decisions.length })}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {decisions.map((decision) => {
          const status = statusPresentation[decision.status]
          const Icon = status.icon

          return (
            <article
              key={decision.id}
              className="flex overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className={`w-1 shrink-0 ${status.bar}`} />
              <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={status.variant}>
                      <Icon />
                      {messages.decisions.status[decision.status]}
                    </Badge>
                    <time className="text-xs text-muted-foreground">{decision.time}</time>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{decision.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {decision.detail}
                  </p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {metricLabel(decision.metricLabel, messages)}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">{decision.metric}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
