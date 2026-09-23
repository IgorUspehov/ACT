import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import { I18nContext } from "@/i18n/context"
import { de } from "@/i18n/de"
import { en } from "@/i18n/en"
import { ru } from "@/i18n/ru"
import type { Locale, Messages } from "@/i18n/types"

const catalogs: Record<Locale, Messages> = { en, de, ru }

const STORAGE_KEY = "act-locale"

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "de" || stored === "ru") return stored
  } catch {
    return "en"
  }
  return "en"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = catalogs[locale].meta.title
  }, [locale])

  function setLocale(next: Locale) {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }
  }

  return (
    <I18nContext.Provider value={{ locale, messages: catalogs[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
