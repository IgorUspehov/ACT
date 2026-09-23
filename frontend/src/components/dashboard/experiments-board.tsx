import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { experimentStages, type ExperimentStageId } from "@/data/demo"
import { fill, useI18n } from "@/i18n"
import type { Messages } from "@/i18n/types"
import { cn } from "@/lib/utils"

const stageTone: Record<
  ExperimentStageId,
  { chip: string; bar: string; label: string }
> = {
  TEST: {
    chip: "bg-blue-50 text-blue-700",
    bar: "bg-blue-600",
    label: "text-blue-700",
  },
  MEASURE: {
    chip: "bg-primary text-primary-foreground",
    bar: "bg-primary",
    label: "text-foreground",
  },
  DECISION: {
    chip: "bg-secondary text-foreground",
    bar: "bg-foreground",
    label: "text-foreground",
  },
  ACTION: {
    chip: "bg-green-50 text-green-700",
    bar: "bg-green-600",
    label: "text-green-700",
  },
}

function experimentBadge(badge: string, messages: Messages) {
  if (
    badge === "Running" ||
    badge === "Stop" ||
    badge === "Promote" ||
    badge === "Live" ||
    badge === "Queued"
  ) {
    return messages.experiments.badge[badge]
  }
  return badge
}

export function ExperimentsBoard() {
  const { messages } = useI18n()

  return (
    <section id="experiments" className="scroll-mt-28 space-y-4">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{messages.experiments.title}</h2>
        <p className="mt-2 flex flex-wrap items-center gap-x-1 text-sm font-semibold tracking-wide">
          {experimentStages.map((stage, index) => (
            <span key={stage.id} className="inline-flex items-center gap-1">
              <span className={stageTone[stage.id].label}>{messages.experiments.stage[stage.id]}</span>
              {index < experimentStages.length - 1 ? (
                <ArrowRight className="size-3.5 text-muted-foreground" />
              ) : null}
            </span>
          ))}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        {experimentStages.map((stage) => {
          const tone = stageTone[stage.id]
          return (
            <article
              key={stage.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className={cn("h-1", tone.bar)} />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                      {fill(messages.experiments.step, { step: stage.step })}
                    </p>
                    <h3 className={cn("mt-1 text-sm font-semibold", tone.label)}>
                      {messages.experiments.stage[stage.id]}
                    </h3>
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", tone.chip)}>
                    {stage.items.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{messages.experiments.summary[stage.id]}</p>
                <ul className="mt-1 space-y-2">
                  {stage.items.map((item) => (
                    <li key={item.id} className="rounded-lg bg-secondary/70 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.badge && item.badgeTone ? (
                          <Badge variant={item.badgeTone}>{experimentBadge(item.badge, messages)}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                      <p className="mt-2 text-xs font-medium">{item.meta}</p>
                      {item.progress !== undefined ? (
                        <div className="mt-2">
                          <div className="h-1.5 overflow-hidden rounded-full bg-background">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
