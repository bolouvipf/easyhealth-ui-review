import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import fr from "./fr.json"
import en from "./en.json"

type Translations = Record<string, any>

const STORAGE_KEY = "easyhealth_lang"

const translations: Record<string, Translations> = { fr, en }

const BACKEND_MESSAGE_KEYS: Array<[string, string]> = [
  ["Si cet email existe, un lien de réinitialisation a été envoyé.", "backend.forgot_sent"],
  ["Mot de passe réinitialisé avec succès", "backend.reset_ok"],
  ["Utilisateur supprimé avec succès", "backend.user_deleted"],
  ["Compte admin créé avec succès", "backend.admin_created"],
  ["Mot de passe admin réinitialisé avec succès", "backend.admin_reset"],
  ["Le numéro d'enregistrement professionnel est requis pour les professionnels", "backend.license_required"],
  ["L'établissement est requis pour les professionnels", "backend.establishment_required"],
  ["Dossier désactivé avec succès", "backend.record_deactivated"],
]

const LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US" }

interface LanguageContextType {
  lang: string
  locale: string
  setLang: (lang: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
  tb: (message: string | undefined | null, fallbackKey?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function resolve(obj: any, key: string): string | undefined {
  const parts = key.split(".")
  let current = obj
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = current[part]
  }
  return typeof current === "string" ? current : undefined
}

function interpolate(message: string, params?: Record<string, string | number>): string {
  if (!params) return message
  let result = message
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(`{${k}}`, String(v))
  }
  return result
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || navigator.language?.substring(0, 2) || "fr"
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((newLang: string) => {
    if (translations[newLang]) setLangState(newLang)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[lang] ?? translations["fr"] ?? {}
      const message = resolve(dict, key) ?? key
      return interpolate(message, params)
    },
    [lang],
  )

  const tb = useCallback(
    (message: string | undefined | null, fallbackKey?: string): string => {
      if (message) {
        const found = BACKEND_MESSAGE_KEYS.find(([fr]) => fr === message)
        if (found) {
          const dict = translations[lang] ?? translations["fr"] ?? {}
          const local = resolve(dict, found[1])
          if (local) return local
        }
      }
      if (fallbackKey) {
        const dict = translations[lang] ?? translations["fr"] ?? {}
        const local = resolve(dict, fallbackKey)
        if (local) return local
      }
      return message ?? ""
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, locale: LOCALES[lang] ?? "fr-FR", setLang, t, tb }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
