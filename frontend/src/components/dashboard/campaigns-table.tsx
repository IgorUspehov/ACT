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
import {
  campaigns,
  reportingWindow,
  totalsOf,
  type CampaignStatus,
} from "@/data/demo"
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

export function CampaignsTable() {
  const { messages } = useI18n()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return campaigns.filter((campaign) => {
      const matchesStatus = status === "All" || campaign.status === status
      const matchesQuery = needle.length === 0 || campaign.name.toLowerCase().includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [query, status])

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
                  shown: rows.length,
                  total: campaigns.length,
                  window: reportingWindow,
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
          <Table className="min-w-[880px]">
            <TableCaption>
              {fill(messages.campaigns.caption, { window: reportingWindow })}
            </TableCaption>
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
                      <Badge variant={statusVariant[campaign.status]}>
                        {messages.campaigns.status[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(campaign.spend)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(campaign.installs)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(campaign.purchases)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(campaign.revenue)}
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
                    {formatMoney(totals.spend)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(totals.installs)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(totals.purchases)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(totals.revenue)}
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
        </CardContent>
      </Card>
    </section>
  )
}
