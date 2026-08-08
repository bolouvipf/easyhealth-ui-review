import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useLanguage } from "../i18n/LanguageContext"
import "./LandingPage.css"

interface PatientData {
  name: string
  age: number
  bloodType: string
  allergies: string[]
  conditions?: string[]
  medications?: string[]
  lastVisit: string
}

function FloatingNav({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container landing-nav-inner">
        <Link to="/" className="landing-nav-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          EasyHealth
        </Link>

        <div className={`landing-nav-links ${mobileOpen ? "open" : ""}`}>
          <button className="nav-link-btn" onClick={() => { scrollTo("features"); setMobileOpen(false) }}>{t("landing.nav_features")}</button>
          <button className="nav-link-btn" onClick={() => { scrollTo("demo"); setMobileOpen(false) }}>{t("landing.nav_demo")}</button>
          <Link to="/faq" onClick={() => setMobileOpen(false)}>{t("landing.nav_faq")}</Link>
          <Link to="/guide-patient" onClick={() => setMobileOpen(false)}>{t("landing.nav_guide_patient")}</Link>
          <Link to="/guide-pro" onClick={() => setMobileOpen(false)}>{t("landing.nav_guide_pro")}</Link>
          <Link to="/forgot-password" className="nav-link-muted" onClick={() => setMobileOpen(false)}>{t("landing.nav_forgot")}</Link>
          <div className="landing-nav-cta">
            <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>{t("landing.nav_login")}</Link>
            <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>{t("landing.nav_register")}</Link>
          </div>
        </div>

        <button
          className="landing-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t("nav.menu_close") : t("nav.menu_open")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
      </div>
    </nav>
  )
}

function HeroSection({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [animate, setAnimate] = useState(false)
  const { t } = useLanguage()
  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className={`hero-text ${animate ? "is-visible" : ""}`}>
          <span className="pill">
            <span className="dot" />
            {t("landing.pill")}
          </span>
          <h1>
            {t("landing.hero_title_1")} <span className="accent">{t("landing.hero_title_accent")}</span> {t("landing.hero_title_2")}
          </h1>
          <p className="lead">
            {t("landing.hero_lead")}
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              {t("landing.cta_create")}
            </Link>
            <Link to="/login" className="btn btn-ghost">
              {t("landing.cta_login")}
            </Link>
          </div>
          <ul className="hero-trust">
            <li>{t("landing.trust_apdp")}</li>
            <li>{t("landing.trust_aes")}</li>
            <li>{t("landing.trust_hosting")}</li>
          </ul>
        </div>

        <div className={`hero-visual ${animate ? "is-visible" : ""}`}>
          <div className="hero-media">
            <div className="hero-fallback">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{t("landing.hero_fallback")}</span>
            </div>
            <img
              src="/doctor-hero.png"
              alt={t("landing.hero_img_alt")}
              className="hero-img"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const PHASE_IDS = ["home", "code", "access", "open"] as const

function DoctorScanAnimation() {
  const [phase, setPhase] = useState(0)
  const [code, setCode] = useState("")
  const [patient, setPatient] = useState<PatientData | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    let active = true
    const run = async () => {
      while (active) {
        for (let i = 0; i < PHASE_IDS.length; i++) {
          if (!active) return
          setPhase(i)
          if (i === 1) {
            setCode("EH-" + Math.random().toString(36).slice(2, 10).toUpperCase())
            await new Promise((r) => setTimeout(r, 1600))
            setPatient({
              name: "Marie KOUASSI",
              age: 34,
              bloodType: "O+",
              allergies: ["Pénicilline"],
              lastVisit: "15/01/2024",
            })
          }
          if (i === 3) setPatient(null)
          await new Promise((r) => setTimeout(r, 2400))
        }
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="app-bar">
          <div className="app-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>EasyHealth</span>
          </div>
        </div>

        {phase === 0 && (
          <div className="screen-pad">
            <div className="home-card">
              <h4>{t("landing.phone_home")}</h4>
              <p>{t("landing.phone_home_desc")}</p>
            </div>
            <div className="home-card">
              <h4>{t("landing.phone_share")}</h4>
              <p>{t("landing.phone_share_desc")}</p>
            </div>
            <div className="home-card">
              <h4>{t("landing.phone_audit")}</h4>
              <p>{t("landing.phone_audit_desc")}</p>
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="screen-pad center">
            <div className="big-code-display">{code || "EH-XXXXXXXX"}</div>
            <p className="scan-hint">{t("landing.phone_code_generated")}</p>
          </div>
        )}

        {phase === 2 && (
          <div className="screen-pad center">
            <div className="check">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3>{t("landing.phone_access_granted")}</h3>
            <p className="muted">Dr. Pierre BOLOUVI{t("landing.phone_doctor_label")}</p>
          </div>
        )}

        {phase === 3 && patient && (
          <div className="screen-pad">
            <div className="patient-head">
              <div className="avatar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <strong>{patient.name}</strong>
                <p className="muted">{patient.age} {t("landing.phone_years")} · {patient.bloodType}</p>
              </div>
            </div>
            <div className="kv">
              <span>{t("landing.phone_allergies")}</span>
              <b className="warn">{patient.allergies.join(", ")}</b>
            </div>
            <div className="kv">
              <span>{t("landing.phone_last_visit")}</span>
              <b>{patient.lastVisit}</b>
            </div>
          </div>
        )}
      </div>

      <div className="phone-dots">
        {PHASE_IDS.map((_, i) => (
          <span key={i} className={i === phase ? "on" : ""} />
        ))}
      </div>
    </div>
  )
}

function DemoSection() {
  const [scan, setScan] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const runScan = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    setScan({
      name: "Jean DUPONT",
      age: 45,
      bloodType: "A+",
      allergies: [t("landing.demo_no_allergy")],
      conditions: ["Hypertension", "Diabète type 2"],
      medications: ["Amlodipine 5mg", "Metformine 500mg"],
      lastVisit: "20/11/2024",
    })
    setLoading(false)
  }

  return (
    <section id="demo" className="section demo" data-anchor="demo">
      <div className="container">
        <div className="demo-visual">
          <DoctorScanAnimation />
        </div>
        <header className="section-head">
          <span className="eyebrow">{t("landing.demo_eyebrow")}</span>
          <h2>{t("landing.demo_title")}</h2>
          <p>{t("landing.demo_desc")}</p>
        </header>

        <div className="demo-grid">
          <div className="demo-card">
            <div className="card-label">{t("landing.demo_card_label")}</div>
            {scan ? (
              <div className="result">
                <div className="result-top">
                  <div className="check small">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <strong>{t("landing.demo_unlocked")}</strong>
                    <p className="muted">Dr. Pierre BOLOUVI</p>
                  </div>
                </div>
                <div className="profile">
                  <div className="avatar">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <strong>{scan.name}</strong>
                    <p className="muted">{scan.age} {t("landing.phone_years")} · {scan.bloodType}</p>
                  </div>
                </div>
                <div className="tags">
                  {scan.allergies.map((a) => (
                    <span key={a} className="tag warn">{a}</span>
                  ))}
                  {scan.conditions?.map((c) => (
                    <span key={c} className="tag">{c}</span>
                  ))}
                </div>
                <button className="btn btn-ghost full" onClick={() => setScan(null)}>
                  {t("landing.demo_restart")}
                </button>
              </div>
            ) : (
              <div className="demo-idle">
                <button className="btn btn-primary full" onClick={runScan} disabled={loading}>
                  {loading ? t("landing.demo_checking") : t("landing.demo_btn")}
                </button>
                <p className="hint">{t("landing.demo_hint")}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useLanguage()
  const features = [
    {
      title: t("landing.feature1_title"),
      desc: t("landing.feature1_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: t("landing.feature2_title"),
      desc: t("landing.feature2_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      ),
    },
    {
      title: t("landing.feature3_title"),
      desc: t("landing.feature3_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      ),
    },
    {
      title: t("landing.feature4_title"),
      desc: t("landing.feature4_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: t("landing.feature5_title"),
      desc: t("landing.feature5_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: t("landing.feature6_title"),
      desc: t("landing.feature6_desc"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
  ]

  return (
    <section id="features" className="section features">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">{t("landing.features_eyebrow")}</span>
          <h2>{t("landing.features_title")}</h2>
          <p>{t("landing.features_desc")}</p>
        </header>
        <div className="feature-grid">
          {features.map((f) => (
            <article key={f.title} className="feature">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useLanguage()
  return (
    <section className="section cta">
      <div className="container cta-inner">
        <h2>{t("landing.cta_title")}</h2>
        <p>{t("landing.cta_desc")}</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary">
            {t("landing.cta_create")}
          </Link>
          <Link to="/login" className="btn btn-ghost">
            {t("landing.cta_login")}
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>EasyHealth</span>
          </Link>
          <p>{t("landing.footer_desc")}</p>
        </div>
        <nav className="footer-col">
          <h4>{t("landing.footer_nav")}</h4>
          <Link to="/">{t("landing.footer_home")}</Link>
          <Link to="/register">{t("landing.footer_register")}</Link>
          <Link to="/login">{t("landing.footer_login")}</Link>
        </nav>
        <nav className="footer-col">
          <h4>{t("landing.footer_resources")}</h4>
          <a href="https://easyhealth-api.onrender.com/api/v1/docs" target="_blank" rel="noreferrer">{t("landing.footer_api_docs")}</a>
          <Link to="/guide-patient">{t("landing.nav_guide_patient")}</Link>
          <Link to="/guide-pro">{t("landing.footer_guide_pro")}</Link>
          <Link to="/faq">{t("landing.nav_faq")}</Link>
        </nav>
        <nav className="footer-col">
          <h4>{t("landing.footer_legal")}</h4>
          <Link to="/privacy">{t("landing.footer_privacy")}</Link>
          <Link to="/privacy">{t("landing.footer_legal_mentions")}</Link>
          <Link to="/privacy">{t("landing.footer_apdp")}</Link>
        </nav>
        <div className="footer-col">
          <h4>{t("landing.footer_contact")}</h4>
          <p>{t("landing.footer_city")}</p>
          <a href="mailto:contact@easyhealth.bj">contact@easyhealth.bj</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t("landing.footer_rights")}</span>
        <span className="badges">
          <span className="badge">{t("landing.footer_badge_apdp")}</span>
          <span className="badge">{t("landing.footer_badge_aes")}</span>
        </span>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing">
      <a href="#main" className="skip">{t("landing.skip")}</a>
      <FloatingNav scrollTo={scrollTo} />
      <HeroSection scrollTo={scrollTo} />
      <main id="main">
        <DemoSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
