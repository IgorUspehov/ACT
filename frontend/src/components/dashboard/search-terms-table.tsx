import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type SearchSignal, type SearchTerm } from "@/data/demo"
import type { Resource } from "@/lib/api"
import { fill, useI18n } from "@/i18n"
import { formatMoney, formatNumber } from "@/lib/format"
import { cpa } from "@/lib/metrics"
import { cn } from "@/lib/utils"

const signalVariant = {
  Scale: "success",
  Keep: "info",
  Negative: "destructive",
  Test: "warning",
  "Add keyword": "default",
} as const satisfies Record<SearchSignal, "success" | "info" | "destructive" | "warning" | "default">

export function SearchTermsTable({ source }: { source: Resource<SearchTerm[]> }) {
  const { messages } = useI18n()
  const [query, setQuery] = useState("")
  const searchTerms = source.status === "ready" ? source.data : []

  const rows = useMemo(() => {
    if (source.status !== "ready") return []
    const needle = query.trim().toLowerCase()
    if (needle.length === 0) return source.data
    return source.data.filter((row) => {
      return (
        row.term.toLowerCase().includes(needle) || row.campaign.toLowerCase().includes(needle)
      )
    })
  }, [query, source])

  return (
    <section id="search-terms" className="scroll-mt-28">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>{messages.searchTerms.title}</CardTitle>
              <CardDescription className="mt-1">
                {fill(messages.searchTerms.summary, {
                  shown: source.status === "ready" ? rows.length : 0,
                  total: searchTerms.length,
                })}
              </CardDescription>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={messages.searchTerms.searchPlaceholder}
                aria-label={messages.searchTerms.searchLabel}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {source.status !== "ready" ? (
            <p
              className={
                source.status === "error"
                  ? "px-6 py-10 text-sm text-red-600"
                  : "px-6 py-10 text-sm text-muted-foreground"
              }
              role="status"
            >
              {source.status === "error" ? messages.feedback.error : messages.feedback.loading}
            </p>
          ) : (
          <Table className="min-w-[980px]">
            <TableCaption>{messages.searchTerms.caption}</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{messages.searchTerms.columns.term}</TableHead>
                <TableHead>{messages.searchTerms.columns.match}</TableHead>
                <TableHead>{messages.searchTerms.columns.campaign}</TableHead>
                <TableHead className="text-right">{messages.searchTerms.columns.impressions}</TableHead>
                <TableHead className="text-right">{messages.searchTerms.columns.installs}</TableHead>
                <TableHead className="text-right">{messages.searchTerms.columns.purchases}</TableHead>
                <TableHead className="text-right">{messages.searchTerms.columns.spend}</TableHead>
                <TableHead className="text-right">{messages.searchTerms.columns.cpa}</TableHead>
                <TableHead>{messages.searchTerms.columns.signal}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    {messages.searchTerms.empty}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const value = cpa(row.spend, row.purchases)
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.term}</TableCell>
                      <TableCell>
                        {row.match ? (
                          <Badge variant="outline">{messages.searchTerms.match[row.match]}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{row.campaign}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(row.impressions)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(row.installs)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(row.purchases)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(row.spend, 2)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          value !== null && value <= 10 && "font-medium text-green-700",
                          value !== null && value >= 40 && "font-medium text-red-600",
                        )}
                      >
                        {value === null ? "—" : formatMoney(value, 2)}
                      </TableCell>
                      <TableCell>
                        {row.signal ? (
                          <Badge variant={signalVariant[row.signal]}>
                            {messages.searchTerms.signal[row.signal]}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
