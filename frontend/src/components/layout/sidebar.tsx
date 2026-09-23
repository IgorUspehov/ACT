import { navItems, type SectionId } from "@/components/layout/nav"
import { useI18n } from "@/i18n"
import type { Messages } from "@/i18n/types"
import { cn } from "@/lib/utils"

const sectionKey: Record<SectionId, keyof Messages["nav"]> = {
  overview: "overview",
  campaigns: "campaigns",
  "search-terms": "searchTerms",
  decisions: "decisions",
  experiments: "experiments",
}

type SidebarProps = {
  active: SectionId
  onNavigate: (id: SectionId) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { messages } = useI18n()

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-t-4 border-t-primary border-r border-r-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 items-center rounded-lg bg-primary px-2.5 text-sm font-bold tracking-tight text-primary-foreground">
          ACT
        </div>
        <div>
          <p className="text-sm leading-none font-semibold">ACT</p>
          <p className="mt-1 text-xs text-muted-foreground">{messages.brand.performance}</p>
        </div>
      </div>

      <nav aria-label={messages.nav.primary} className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="min-w-0">{messages.nav[sectionKey[item.id]]}</span>
              {isActive ? <span className="ml-auto size-1.5 rounded-full bg-primary" /> : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {messages.workspace.label}
        </p>
        <p className="mt-1 text-sm font-semibold">{messages.workspace.account}</p>
        <p className="mt-1 text-xs text-muted-foreground">{messages.workspace.sample}</p>
      </div>
    </aside>
  )
}
