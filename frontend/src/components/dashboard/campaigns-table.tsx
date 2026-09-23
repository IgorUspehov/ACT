import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { totalsOf, type Campaign, type CampaignStatus } from "@/data/demo"
import type { Resource } from "@/lib/api"
import { formatMoney, formatNumber, formatRoas } from "@/lib/format"
import { fill, useI18n } from "@/i18n"
import { cpa, roas } from "@/lib/metrics"
import { cn } from "@/lib/utils"

const statusFilters = ["All", "Active", "Learning", "Limited", "Paused"] as const
type StatusFilter = (typeof statusFilters)[number]

const statusVariant = {
  Active: "success",
  Paused: "secondary",
  Learning: "info",
  Limited: "destructive",
} as const satisfies Record<CampaignStatus, "success" | "secondary" | "info" | "destructive">

function CpaCell({ spend, purchases }: { spend: number; purchases: number }) {
  const value = cpa(spend, purchases)
  if (value === null) return <span className="text-muted-foreground">—</span>
  return (
    <span
      className={cn(
        "tabular-nums",
        value <= 20 && "font-medium text-green-700",
        value >= 40 && "font-medium text-red-600",
      )}
    >
      {formatMoney(value, 2)}
    </span>
  )
}

function RoasCell({ revenue, spend }: { revenue: number; spend: number }) {
  const value = roas(revenue, spend)
  if (value === null) return <span className="text-muted-foreground">—</span>
  return (
    <span
      className={cn(
        "tabular-nums",
        value >= 2 && "font-medium text-green-700",
        value < 1.2 && "font-medium text-red-600",
      )}
    >
      {formatRoas(value)}
    </span>
  )
}

function ApiNotice({ source }: { source: Exclude<Resource<Campaign[]>, { status: "ready" }> }) {
  const { messages } = useI18n()
  const failed = source.status === "error"
  return (
    <p className={failed ? "px-6 py-10 text-sm text-red-600" : "px-6 py-10 text-sm text-muted-foreground"} role="status">
      {failed ? messages.feedback.error : messages.feedback.loading}
    </p>
  )
}

export function CampaignsTable({ source }: { source: Resource<Campaign[]> }) {
  const { messages } = useI18n()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const campaigns = source.status === "ready" ? source.data : []

  const rows = useMemo(() => {
    if (source.status !== "ready") return []
    const needle = query.trim().toLowerCase()
    return source.data.filter((campaign) => {
      const matchesStatus = status === "All" || campaign.status === status
      const matchesQuery = needle.length === 0 || campaign.name.toLowerCase().includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [source, query, status])

  const totals = totalsOf(rows)

  return (
    <section id="campaigns" className="scroll-mt-28">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="gap-4 border-b py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>{messages.campaigns.title}</CardTitle>
              <CardDescription className="mt-1">
                {fill(messages.campaigns.summary, {
                  shown: source.status === "ready" ? rows.length : 0,
                  total: campaigns.length,
                })}
              </CardDescription>
            </div>
            <div className="relative w-full lg:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={messages.campaigns.searchPlaceholder}
                aria-label={messages.campaigns.searchLabel}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                type="button"
                size="sm"
                variant={status === filter ? "default" : "outline"}
                aria-pressed={status === filter}
                onClick={() => setStatus(filter)}
              >
                {filter === "All" ? messages.campaigns.status.all : messages.campaigns.status[filter]}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {source.status !== "ready" ? (
            <ApiNotice source={source} />
          ) : (
          <Table className="min-w-[880px]">
            <TableCaption>{messages.campaigns.caption}</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{messages.campaigns.columns.campaign}</TableHead>
                <TableHead>{messages.campaigns.columns.status}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.spend}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.installs}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.purchases}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.revenue}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.cpa}</TableHead>
                <TableHead className="text-right">{messages.campaigns.columns.roas}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    {messages.campaigns.empty}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      {campaign.status ? (
                        <Badge variant={statusVariant[campaign.status]}>
                          {messages.campaigns.status[campaign.status]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(campaign.spend, 2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(campaign.installs)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(campaign.purchases)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(campaign.revenue, 2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <CpaCell spend={campaign.spend} purchases={campaign.purchases} />
                    </TableCell>
                    <TableCell className="text-right">
                      <RoasCell revenue={campaign.revenue} spend={campaign.spend} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {rows.length > 0 ? (
              <TableFooter>
                <TableRow className="hover:bg-transparent">
                  <TableCell>{messages.campaigns.total}</TableCell>
                  <TableCell />
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(totals.spend, 2)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(totals.installs)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(totals.purchases)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(totals.revenue, 2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <CpaCell spend={totals.spend} purchases={totals.purchases} />
                  </TableCell>
                  <TableCell className="text-right">
                    <RoasCell revenue={totals.revenue} spend={totals.spend} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            ) : null}
          </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
