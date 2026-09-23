import { createContext, useContext } from "react"

import type { Locale, Messages } from "@/i18n/types"

export type I18nValue = {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error("useI18n must be used within I18nProvider")
  return value
}
