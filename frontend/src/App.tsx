import { useEffect, useRef, useState } from "react"

import { CampaignsTable } from "@/components/dashboard/campaigns-table"
import { DecisionsPanel } from "@/components/dashboard/decisions-panel"
import { ExperimentsBoard } from "@/components/dashboard/experiments-board"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { SearchTermsTable } from "@/components/dashboard/search-terms-table"
import { navItems, type SectionId } from "@/components/layout/nav"
import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import { useI18n } from "@/i18n"
import { useDashboardData } from "@/lib/api"

const SCROLL_MARKER = 140

function sectionAtMarker(): SectionId {
  let current: SectionId = navItems[0].id
  for (const item of navItems) {
    const node = document.getElementById(item.id)
    if (!node) continue
    if (node.getBoundingClientRect().top <= SCROLL_MARKER) current = item.id
  }
  return current
}

export default function App() {
  const [active, setActive] = useState<SectionId>("overview")
  const lock = useRef(false)
  const { messages } = useI18n()
  const dashboard = useDashboardData()

  useEffect(() => {
    function update() {
      if (lock.current) return
      setActive(sectionAtMarker())
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  function navigate(id: SectionId) {
    lock.current = true
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    window.setTimeout(() => {
      lock.current = false
      setActive(sectionAtMarker())
    }, 700)
  }

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar active={active} onNavigate={navigate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar active={active} onNavigate={navigate} />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 py-6 pb-[40vh] sm:px-6 lg:px-8">
          <KpiGrid campaigns={dashboard.campaigns} />
          <CampaignsTable source={dashboard.campaigns} />
          <SearchTermsTable source={dashboard.searchTerms} />
          <DecisionsPanel source={dashboard.decisions} />
          <ExperimentsBoard />
          <p className="pb-2 text-center text-xs text-muted-foreground">{messages.footer}</p>
        </main>
      </div>
    </div>
  )
}
