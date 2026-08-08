import { Link } from "react-router-dom"
import { useLanguage } from "../i18n/LanguageContext"
import LanguageSwitcher from "../components/LanguageSwitcher"

interface ScreenCard {
  title: string
  desc: string
  to: string
  tag?: string
  icon: string
}

const SCREENS: ScreenCard[] = [
  { title: "Accueil / Landing", desc: "Page publique d'accueil avec présentation du produit.", to: "/", tag: "Public", icon: "🏠" },
  { title: "Connexion", desc: "Écran de connexion des professionnels et patients.", to: "/login", tag: "Auth", icon: "🔑" },
  { title: "Inscription", desc: "Création de compte avec sélection du rôle.", to: "/register", tag: "Auth", icon: "📝" },
  { title: "Mot de passe oublié", desc: "Demande de réinitialisation du mot de passe.", to: "/forgot-password", tag: "Auth", icon: "🔐" },
  { title: "Connexion admin", desc: "Portail d'administration restreint.", to: "/admin-login", tag: "Auth", icon: "🛡️" },
  { title: "Tableau de bord (Médecin)", desc: "Dossiers patients, statistiques, entrées cliniques.", to: "/dashboard", tag: "Connecté", icon: "📋" },
  { title: "Détail du dossier patient", desc: "Fiche patient complète avec entrées cliniques.", to: "/patient/p-1", tag: "Connecté", icon: "👤" },
  { title: "Espace patient", desc: "Vue patient de son propre dossier.", to: "/patient-dashboard", tag: "Connecté", icon: "🩺" },
  { title: "Partage sécurisé", desc: "Génération de code de partage temporaire.", to: "/share/p-1", tag: "Connecté", icon: "🔗" },
  { title: "Journal d'audit", desc: "Traçabilité complète des actions.", to: "/audit", tag: "Admin", icon: "📜" },
  { title: "Administration", desc: "Statistiques, gestion des utilisateurs, vérifications.", to: "/admin", tag: "Admin", icon: "⚙️" },
  { title: "FAQ", desc: "Questions fréquentes.", to: "/faq", tag: "Public", icon: "❓" },
  { title: "Confidentialité", desc: "Politique de confidentialité et consentement.", to: "/privacy", tag: "Public", icon: "🔒" },
  { title: "Guide patient", desc: "Guide d'utilisation pour les patients.", to: "/guide-patient", tag: "Public", icon: "📖" },
  { title: "Guide professionnel", desc: "Guide d'utilisation pour les professionnels de santé.", to: "/guide-pro", tag: "Public", icon: "📘" },
  { title: "Page 404", desc: "Page non trouvée.", to: "/page-inexistante", tag: "Public", icon: "🚧" },
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
            EasyHealth <span className="hub-brand-sub">· Revue de l'interface</span>
          </div>
          <div className="hub-top-actions">
            <LanguageSwitcher />
            <Link to="/" className="btn btn-primary btn-sm">{t("landing.nav_home")}</Link>
          </div>
        </div>
      </header>

      <main className="container hub-main">
        <h1>{t("demo.hub_title")}</h1>
        <p className="hub-subtitle">{t("demo.hub_subtitle")}</p>

        <h2 className="hub-section-title">{t("demo.hub_screens")}</h2>
        <div className="hub-grid">
          {SCREENS.map((s) => (
            <Link key={s.to + s.title} to={s.to} className="hub-card">
              <span className="hub-card-icon">{s.icon}</span>
              <span className="hub-card-body">
                <span className="hub-card-title">{s.title}</span>
                <span className="hub-card-desc">{s.desc}</span>
              </span>
              <span className={`hub-tag hub-tag-${s.tag?.toLowerCase()}`}>{s.tag}</span>
            </Link>
          ))}
        </div>

        <p className="hub-hint">{t("demo.hub_hint")}</p>
      </main>

      <footer className="hub-footer">
        <div className="container">
          <span>EasyHealth — maquette de revue UI · données fictives · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
