import { useState } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"
import "./LegalPage.css"

const FAQ_KEYS = Array.from({ length: 9 }, (_, i) => ({ q: `faq.q${i + 1}`, a: `faq.a${i + 1}` }))

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useLanguage()

  return (
    <div className="legal-page">
      <header className="legal-hero">
        <div className="container">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h1>{t("faq.title")}</h1>
          <p>{t("faq.intro")}</p>
        </div>
      </header>

      <div className="legal-body">
        <div className="faq-list">
          {FAQ_KEYS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{t(item.q)}</span>
                  <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="faq-a">
                    <p>{t(item.a)}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Link to="/" className="legal-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("faq.back")}
        </Link>
      </div>
    </div>
  )
}
