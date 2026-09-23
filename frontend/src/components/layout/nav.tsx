import {
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Search,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type SectionId =
  | "overview"
  | "campaigns"
  | "search-terms"
  | "decisions"
  | "experiments"

export const navItems: { id: SectionId; icon: LucideIcon }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "campaigns", icon: Megaphone },
  { id: "search-terms", icon: Search },
  { id: "decisions", icon: ListChecks },
  { id: "experiments", icon: FlaskConical },
]
