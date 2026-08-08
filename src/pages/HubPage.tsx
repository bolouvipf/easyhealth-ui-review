import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"
import LanguageSwitcher from "../components/LanguageSwitcher"

interface ScreenCard {
  titleKey: string
  descKey: string
  to: string
  tag: string
  icon: string
}

const SCREENS: ScreenCard[] = [
  { titleKey: "demo.sc_landing_title", descKey: "demo.sc_landing_desc", to: "/", tag: "Public", icon: "🏠" },
  { titleKey: "demo.sc_login_title", descKey: "demo.sc_login_desc", to: "/login", tag: "Auth", icon: "🔑" },
  { titleKey: "demo.sc_register_title", descKey: "demo.sc_register_desc", to: "/register", tag: "Auth", icon: "📝" },
  { titleKey: "demo.sc_forgot_title", descKey: "demo.sc_forgot_desc", to: "/forgot-password", tag: "Auth", icon: "🔐" },
  { titleKey: "demo.sc_adminlogin_title", descKey: "demo.sc_adminlogin_desc", to: "/adminlogin", tag: "Auth", icon: "🛡️" },
  { titleKey: "demo.sc_dashboard_title", descKey: "demo.sc_dashboard_desc", to: "/dashboard", tag: "Connecté", icon: "📋" },
  { titleKey: "demo.sc_patient_title", descKey: "demo.sc_patient_desc", to: "/patient/p-1", tag: "Connecté", icon: "👤" },
  { titleKey: "demo.sc_patdash_title", descKey: "demo.sc_patdash_desc", to: "/patient-dashboard", tag: "Connecté", icon: "🩺" },
  { titleKey: "demo.sc_share_title", descKey: "demo.sc_share_desc", to: "/share/p-1", tag: "Connecté", icon: "🔗" },
  { titleKey: "demo.sc_audit_title", descKey: "demo.sc_audit_desc", to: "/audit", tag: "Admin", icon: "📜" },
  { titleKey: "demo.sc_admin_title", descKey: "demo.sc_admin_desc", to: "/admin", tag: "Admin", icon: "⚙️" },
  { titleKey: "demo.sc_faq_title", descKey: "demo.sc_faq_desc", to: "/faq", tag: "Public", icon: "❓" },
  { titleKey: "demo.sc_privacy_title", descKey: "demo.sc_privacy_desc", to: "/privacy", tag: "Public", icon: "🔒" },
  { titleKey: "demo.sc_guide_patient_title", descKey: "demo.sc_guide_patient_desc", to: "/guide-patient", tag: "Public", icon: "📖" },
  { titleKey: "demo.sc_guide_pro_title", descKey: "demo.sc_guide_pro_desc", to: "/guide-pro", tag: "Public", icon: "📘" },
  { titleKey: "demo.sc_404_title", descKey: "demo.sc_404_desc", to: "/page-inexistante", tag: "Public", icon: "🚧" },
]

export default function HubPage() {
  const { t } = useLanguage()

  return (
    <div className="hub-page">
      <header className="hub-header">
        <div className="container">
          <div className="hub-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            EasyHealth <span className="hub-brand-sub">· {t("demo.hub_title")}</span>
          </div>
          <div className="hub-top-actions">
            <LanguageSwitcher />
            <Link to="/" className="btn btn-primary btn-sm">{t("nav.home")}</Link>
          </div>
        </div>
      </header>

      <main className="container hub-main">
        <h1>{t("demo.hub_title")}</h1>
        <p className="hub-subtitle">{t("demo.hub_subtitle")}</p>

        <h2 className="hub-section-title">{t("demo.hub_screens")}</h2>
        <div className="hub-grid">
          {SCREENS.map((s) => (
            <Link key={s.to + s.titleKey} to={s.to} className="hub-card">
              <span className="hub-card-icon">{s.icon}</span>
              <span className="hub-card-body">
                <span className="hub-card-title">{t(s.titleKey)}</span>
                <span className="hub-card-desc">{t(s.descKey)}</span>
              </span>
              <span className={`hub-tag hub-tag-${s.tag?.toLowerCase()}`}>{t(`demo.sc_tag_${s.tag.toLowerCase()}`)}</span>
            </Link>
          ))}
        </div>

        <p className="hub-hint">{t("demo.hub_hint")}</p>
      </main>

      <footer className="hub-footer">
        <div className="container">
          <span>EasyHealth — {t("demo.banner_title")} · {t("demo.banner_text")} · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
