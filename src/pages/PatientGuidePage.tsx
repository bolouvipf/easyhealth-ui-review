import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"
import "./LegalPage.css"

const STEP_KEYS = Array.from({ length: 6 }, (_, i) => ({
  title: `guidePatient.s${i + 1}_title`,
}))

export default function PatientGuidePage() {
  const { t } = useLanguage()

  return (
    <div className="legal-page">
      <header className="legal-hero">
        <div className="container">
          <span className="eyebrow">{t("guidePatient.eyebrow")}</span>
          <h1>{t("guidePatient.title")}</h1>
          <p>{t("guidePatient.intro")}</p>
        </div>
      </header>

      <div className="legal-body">
        <div className="legal-card legal-section">
          {STEP_KEYS.map((s, i) => {
            const n = i + 1
            return (
              <div key={s.title} className="legal-section">
                <h2>{t(s.title)}</h2>
                {(() => {
                  switch (n) {
                    case 1:
                      return (
                        <>
                          <p>{t("guidePatient.s1_p1")}</p>
                          <p>{t("guidePatient.s1_p2")}</p>
                        </>
                      )
                    case 2:
                      return (
                        <>
                          <p>{t("guidePatient.s2_p1")}</p>
                          <ul>
                            <li>{t("guidePatient.s2_li1")}</li>
                            <li>{t("guidePatient.s2_li2")}</li>
                            <li>{t("guidePatient.s2_li3")}</li>
                            <li>{t("guidePatient.s2_li4")}</li>
                          </ul>
                          <p>{t("guidePatient.s2_p2")}</p>
                        </>
                      )
                    case 3:
                      return (
                        <>
                          <p>{t("guidePatient.s3_p1")}</p>
                          <p>{t("guidePatient.s3_p2")}</p>
                        </>
                      )
                    case 4:
                      return (
                        <>
                          <p>{t("guidePatient.s4_p1")}</p>
                          <ul>
                            <li>{t("guidePatient.s4_li1")}</li>
                            <li>{t("guidePatient.s4_li2")}</li>
                            <li>{t("guidePatient.s4_li3")}</li>
                          </ul>
                        </>
                      )
                    case 5:
                      return (
                        <ul>
                          <li>{t("guidePatient.s5_li1")}</li>
                          <li>{t("guidePatient.s5_li2")}</li>
                          <li>{t("guidePatient.s5_li3")}</li>
                          <li>{t("guidePatient.s5_li4")}</li>
                        </ul>
                      )
                    default:
                      return (
                        <p>
                          {t("guidePatient.s6_p1")}{" "}
                          <Link to="/privacy">{t("privacy.title")}</Link>{" "}
                          {t("guidePatient.s6_p2")}
                        </p>
                      )
                  }
                })()}
              </div>
            )
          })}
        </div>

        <Link to="/register" className="legal-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          {t("guidePatient.cta")}
        </Link>
      </div>
    </div>
  )
}
