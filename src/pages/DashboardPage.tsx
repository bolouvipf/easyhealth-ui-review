import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useLanguage } from "../i18n/LanguageContext"
import { dashboard as dashboardApi, patients as patientsApi, sharing as sharingApi } from "../services/api"
import type { PatientRecord, ClinicalEntry } from "../types"

function CodeEntryCard({ onAccess }: { onAccess: (recordId: string) => void }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { t, tb } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 8) { setError(t("dashboard.code_error_length")); return }
    setLoading(true)
    setError("")
    try {
      const record = await sharingApi.accessByCode(code)
      onAccess(record.id)
    } catch (err: any) {
      setError(tb(err.response?.data?.message, "dashboard.code_error_invalid"))
    }
    setLoading(false)
  }

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem", marginBottom: "0.75rem" }}>
        {t("dashboard.access_record")}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
        {t("dashboard.access_record_desc")}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder={t("dashboard.code_placeholder")}
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 8)); setError("") }}
          style={{ fontFamily: "var(--font-sans)", fontSize: "1.25rem", letterSpacing: "0.25em", textAlign: "center", maxWidth: "180px" }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t("dashboard.verifying") : t("dashboard.access_btn")}
        </button>
      </form>
      {error && <p style={{ color: "var(--error)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  )
}

function MedecinDashboard() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t, locale } = useLanguage()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      patientsApi.findAll().then(setRecords),
      dashboardApi.getDashboard().then(setStats),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container" style={{ marginTop: "2rem" }}><div className="loading"><div className="spinner"></div>{t("common.loading")}</div></div>

  const myRecords = records.filter((r) => r.createdById === user?.id)
  const recent = [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("dashboard.title")}</h1>
        <Link to="/patients" className="btn btn-primary">{t("dashboard.view_all")}</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="card stat-card card-tinted">
          <div className="stat-value">{stats?.myPatients ?? myRecords.length}</div>
          <div className="stat-label">{t("dashboard.my_patients")}</div>
        </div>
        <div className="card stat-card card-sage">
          <div className="stat-value">{stats?.totalPatients ?? records.length}</div>
          <div className="stat-label">{t("dashboard.total_patients")}</div>
        </div>
        <div className="card stat-card card-slate">
          <div className="stat-value">{stats?.entriesWritten ?? "—"}</div>
          <div className="stat-label">{t("dashboard.clinical_entries")}</div>
        </div>
      </div>

      <CodeEntryCard onAccess={(recordId) => navigate(`/patients/${recordId}`)} />

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem", marginBottom: "1rem" }}>
          {t("dashboard.recent")}
        </h3>
        {recent.length === 0 ? (
          <p className="empty-state">{t("dashboard.no_recent")}</p>
        ) : (
          <div className="patient-grid">
            {recent.map((r) => (
              <div key={r.id} className="card patient-card" onClick={() => navigate(`/patients/${r.id}`)}>
                <h3>{r.prenom} {r.nom}</h3>
                {r.dateNaissance && <p>{t("patient.born_on")} {new Date(r.dateNaissance).toLocaleDateString(locale)}</p>}
                <span className={`consent-badge ${r.consentGiven ? "granted" : "denied"}`}>
                  {r.consentGiven ? t("patient.consent_granted") : t("patient.consent_denied")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function InfirmierDashboard() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t, locale } = useLanguage()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      patientsApi.findAll().then(setRecords),
      dashboardApi.getDashboard().then(setStats),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container" style={{ marginTop: "2rem" }}><div className="loading"><div className="spinner"></div>{t("common.loading")}</div></div>

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("dashboard.title")}</h1>
        <Link to="/patients" className="btn btn-primary">{t("dashboard.view_all_short")}</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="card stat-card card-tinted">
          <div className="stat-value">{stats?.myPatients ?? "—"}</div>
          <div className="stat-label">{t("dashboard.my_patients")}</div>
        </div>
        <div className="card stat-card card-sage">
          <div className="stat-value">{stats?.totalPatients ?? records.length}</div>
          <div className="stat-label">{t("dashboard.total_patients")}</div>
        </div>
        <div className="card stat-card card-slate">
          <div className="stat-value">{stats?.recentEntries?.length ?? "—"}</div>
          <div className="stat-label">{t("dashboard.recent_notes")}</div>
        </div>
      </div>

      <CodeEntryCard onAccess={(recordId) => navigate(`/patients/${recordId}`)} />

      {stats?.recentEntries?.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem", marginBottom: "1rem" }}>
            {t("dashboard.recent_notes")}
          </h3>
          {stats.recentEntries.slice(0, 10).map((e: ClinicalEntry) => (
            <div key={e.id} className="clinical-entry" style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border-mist)" }}>
              <div className="clinical-entry-header">
                <span className={`entry-type-badge ${e.entryType}`}>{e.entryType}</span>
                <span className="entry-date">{new Date(e.createdAt).toLocaleString(locale)}</span>
              </div>
              <div className="entry-content" style={{ fontSize: "0.8125rem" }}>{e.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AgentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ nom: "", prenom: "", dateNaissance: "", sexe: "", telephone: "", adresse: "", profession: "", consentGiven: false })
  const { t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      patientsApi.findAll().then(setRecords),
      dashboardApi.getDashboard().then(setStats),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const record = await patientsApi.create(form)
      setRecords([...records, record])
      setShowCreate(false)
      setForm({ nom: "", prenom: "", dateNaissance: "", sexe: "", telephone: "", adresse: "", profession: "", consentGiven: false })
    } catch (err) {
      console.error(err)
    }
  }

  const myRecords = records.filter((r) => r.createdById === user?.id)

  if (loading) return <div className="container" style={{ marginTop: "2rem" }}><div className="loading"><div className="spinner"></div>{t("common.loading")}</div></div>

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("dashboard.tracked_patients")}</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? t("patient.cancel") : t("dashboard.new_patient")}
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="card stat-card card-tinted">
          <div className="stat-value">{stats?.myPatients ?? myRecords.length}</div>
          <div className="stat-label">{t("dashboard.tracked_patients")}</div>
        </div>
        <div className="card stat-card card-sage">
          <div className="stat-value">{stats?.totalPatients ?? records.length}</div>
          <div className="stat-label">{t("dashboard.total_system")}</div>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem" }}>{t("dashboard.new_patient")}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>{t("patient.nom")}</label>
              <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>{t("patient.prenom")}</label>
              <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t("patient.date_naissance")}</label>
              <input type="date" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t("patient.telephone")}</label>
              <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>{t("patient.adresse")}</label>
            <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.consentGiven} onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })} />
              {" "}{t("patient.consent_obtained")}
            </label>
          </div>
          <button type="submit" className="btn btn-primary">{t("patient.save")}</button>
        </form>
      )}

      <div className="patient-grid">
        {myRecords.map((r) => (
          <div key={r.id} className="card patient-card" onClick={() => navigate(`/patients/${r.id}`)}>
            <h3>{r.prenom} {r.nom}</h3>
            {r.telephone && <p>{r.telephone}</p>}
            <span className={`consent-badge ${r.consentGiven ? "granted" : "denied"}`}>
              {r.consentGiven ? t("patient.consent_granted") : t("patient.consent_denied")}
            </span>
          </div>
        ))}
        {myRecords.length === 0 && <p className="empty-state">{t("dashboard.no_tracked")}</p>}
      </div>
    </div>
  )
}

function AdministratifDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    dashboardApi.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container" style={{ marginTop: "2rem" }}><div className="loading"><div className="spinner"></div>{t("common.loading")}</div></div>

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("dashboard.admin_view")}</h1>
        <Link to="/patients" className="btn btn-primary">{t("dashboard.manage_records")}</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="card stat-card card-tinted">
          <div className="stat-value">{stats?.totalPatients ?? "—"}</div>
          <div className="stat-label">{t("dashboard.stats_active")}</div>
        </div>
        <div className="card stat-card card-sage">
          <div className="stat-value">{stats?.patientsToday ?? "—"}</div>
          <div className="stat-label">{t("dashboard.stats_today")}</div>
        </div>
      </div>
    </div>
  )
}

function PatientDashboardView() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t, locale } = useLanguage()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      patientsApi.findAll().then(setRecords),
      dashboardApi.getDashboard().then(setStats),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("dashboard.my_health_space")}</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="card stat-card card-tinted">
          <div className="stat-value">{stats?.totalRecords ?? records.length}</div>
          <div className="stat-label">{t("dashboard.my_records")}</div>
        </div>
        <div className="card stat-card card-sage">
          <div className="stat-value">{stats?.totalEntries ?? "—"}</div>
          <div className="stat-label">{t("dashboard.clinical_entries")}</div>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>{t("dashboard.loading_records")}</div>
      ) : (
      <div className="patient-grid">
        {records.map((r) => (
          <div key={r.id} className="card patient-card" onClick={() => navigate(`/share/${r.id}`)}>
            <h3>{r.prenom} {r.nom}</h3>
            <p>{t("patient.born_on")} {r.dateNaissance ? new Date(r.dateNaissance).toLocaleDateString(locale) : "—"}</p>
            <span className={`consent-badge ${r.consentGiven ? "granted" : "denied"}`}>
              {r.consentGiven ? t("patient.consent_granted") : t("patient.consent_denied")}
            </span>
          </div>
        ))}
        {records.length === 0 && <p className="empty-state">{t("dashboard.no_records_yet")}</p>}
      </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  switch (user?.role) {
    case "medecin":
      return <MedecinDashboard />
    case "infirmier":
      return <InfirmierDashboard />
    case "agent_communautaire":
      return <AgentDashboard />
    case "administratif":
      return <AdministratifDashboard />
    case "patient":
      return <PatientDashboardView />
    default:
      return <PatientDashboardView />
  }
}