import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"
import "./LegalPage.css"

const SECTION_KEYS = Array.from({ length: 9 }, (_, i) => ({
  title: `privacy.s${i + 1}_title`,
}))

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="legal-page">
      <header className="legal-hero">
        <div className="container">
          <span className="eyebrow">{t("privacy.eyebrow")}</span>
          <h1>{t("privacy.title")}</h1>
          <p>{t("privacy.intro")}</p>
          <p className="legal-updated">{t("privacy.updated")}</p>
        </div>
      </header>

      <div className="legal-body">
        <div className="legal-card legal-section">
          {SECTION_KEYS.map((s, i) => {
            const n = i + 1
            return (
              <div key={s.title} className="legal-section">
                <h2>{t(s.title)}</h2>
                {(() => {
                  switch (n) {
                    case 1:
                      return <p>{t("privacy.s1_p1")}</p>
                    case 2:
                      return (
                        <>
                          <p>{t("privacy.s2_p1")}</p>
                          <ul>
                            <li>{t("privacy.s2_li1")}</li>
                            <li>{t("privacy.s2_li2")}</li>
                            <li>{t("privacy.s2_li3")}</li>
                            <li>{t("privacy.s2_li4")}</li>
                            <li>{t("privacy.s2_li5")}</li>
                          </ul>
                        </>
                      )
                    case 3:
                      return (
                        <>
                          <p>{t("privacy.s3_p1")}</p>
                          <ul>
                            <li>{t("privacy.s3_li1")}</li>
                            <li>{t("privacy.s3_li2")}</li>
                            <li>{t("privacy.s3_li3")}</li>
                            <li>{t("privacy.s3_li4")}</li>
                          </ul>
                        </>
                      )
                    case 4:
                      return <p>{t("privacy.s4_p1")}</p>
                    case 5:
                      return (
                        <>
                          <p>{t("privacy.s5_p1")}</p>
                          <p>{t("privacy.s5_p2")}</p>
                        </>
                      )
                    case 6:
                      return <p>{t("privacy.s6_p1")}</p>
                    case 7:
                      return <p>{t("privacy.s7_p1")}</p>
                    case 8:
                      return (
                        <>
                          <p>{t("privacy.s8_p1")}</p>
                          <ul>
                            <li>{t("privacy.s8_li1")}</li>
                            <li>{t("privacy.s8_li2")}</li>
                            <li>{t("privacy.s8_li3")}</li>
                            <li>{t("privacy.s8_li4")}</li>
                          </ul>
                          <p>{t("privacy.s8_p2")}</p>
                        </>
                      )
                    default:
                      return <p>{t("privacy.s9_p1")}</p>
                  }
                })()}
              </div>
            )
          })}
        </div>

        <Link to="/" className="legal-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("privacy.back")}
        </Link>
      </div>
    </div>
  )
}
