import { navItems, type SectionId } from "@/components/layout/nav"
import { locales, useI18n } from "@/i18n"
import type { Messages } from "@/i18n/types"
import { reportingWindow } from "@/data/demo"
import { cn } from "@/lib/utils"

const sectionKey: Record<SectionId, keyof Messages["nav"]> = {
  overview: "overview",
  campaigns: "campaigns",
  "search-terms": "searchTerms",
  decisions: "decisions",
  experiments: "experiments",
}

type TopBarProps = {
  active: SectionId
  onNavigate: (id: SectionId) => void
}

export function TopBar({ active, onNavigate }: TopBarProps) {
  const { locale, messages, setLocale } = useI18n()

  return (
    <header className="sticky top-0 z-20 border-t-4 border-t-primary border-b bg-card">
      <div className="grid h-14 grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <p className="text-lg font-semibold tracking-tight">ACT</p>
        <p className="hidden text-sm text-muted-foreground md:block">{reportingWindow}</p>
        <div className="flex items-center justify-self-end gap-2">
          <div
            role="group"
            aria-label={messages.language.label}
            className="inline-flex items-center rounded-full border p-0.5"
          >
            {locales.map((code) => {
              const selected = locale === code
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={selected}
                  aria-label={messages.language[code]}
                  onClick={() => setLocale(code)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {code}
                </button>
              )
            })}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap text-primary-foreground">
            <span className="size-1.5 rounded-full bg-primary-foreground" />
            {messages.topbar.environment}
          </span>
        </div>
      </div>

      <nav aria-label={messages.nav.sections} className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {messages.nav[sectionKey[item.id]]}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
