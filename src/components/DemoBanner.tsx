import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"

export default function DemoBanner() {
  const { t } = useLanguage()
  return (
    <div className="demo-banner">
      <span className="demo-banner-dot" />
      <span>
        <strong>{t("demo.banner_title")}</strong> {t("demo.banner_text")}
      </span>
      <Link to="/hub" className="demo-banner-link">{t("demo.back_to_hub")}</Link>
    </div>
  )
}
