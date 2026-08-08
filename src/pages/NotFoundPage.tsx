import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"

const messages = [
  { code: "404", icon: "🩺", title: "notfound.msg1_title", desc: "notfound.msg1_desc" },
  { code: "notfound.msg2_code", icon: "💊", title: "notfound.msg2_title", desc: "notfound.msg2_desc" },
  { code: "notfound.msg3_code", icon: "🫀", title: "notfound.msg3_title", desc: "notfound.msg3_desc" },
  { code: "404", icon: "🏥", title: "notfound.msg4_title", desc: "notfound.msg4_desc" },
]

export default function NotFoundPage() {
  const { t } = useLanguage()
  const m = messages[Math.floor(Math.random() * messages.length)]
  return (
    <div className="not-found-page">
      <div className="card not-found-card">
        <span className="not-found-icon">{m.icon}</span>
        <span className="not-found-code">{m.code.startsWith("notfound.") ? t(m.code) : m.code}</span>
        <h1>{t(m.title)}</h1>
        <p>{t(m.desc)}</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">{t("notfound.back_home")}</Link>
          <Link to="/dashboard" className="btn btn-secondary">{t("notfound.dashboard")}</Link>
        </div>
      </div>
    </div>
  )
}
