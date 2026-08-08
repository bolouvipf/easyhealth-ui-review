import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { patients as patientsApi, dashboard as dashboardApi } from "../services/api"
import { useAuth } from "../hooks/useAuth"
import { useLanguage } from "../i18n/LanguageContext"
import type { PatientRecord } from "../types"

export default function PatientDashboard() {
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t, locale } = useLanguage()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ nom: "", prenom: "", dateNaissance: "", sexe: "", telephone: "", adresse: "", profession: "", consentGiven: false })

  useEffect(() => {
    setLoading(true)
    const fetchRecords = user?.role === "patient" ? patientsApi.findMine : patientsApi.findAll
    Promise.all([
      fetchRecords().then(setRecords),
      dashboardApi.getDashboard().then(setStats),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  const canCreate = user?.role === "medecin" || user?.role === "infirmier" || user?.role === "admin"
  const isPatient = user?.role === "patient"

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

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("patient.list_title")}</h1>
        {canCreate && <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>{t("patient.create_title")}</button>}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem" }}>{t("patient.create_title_long")}</h3>
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
              <label>{t("patient.sexe")}</label>
              <select value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })}>
                <option value="">{t("patient.sexe_placeholder")}</option>
                <option value="M">{t("patient.masculin")}</option>
                <option value="F">{t("patient.feminin")}</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t("patient.telephone")}</label>
              <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t("patient.profession")}</label>
              <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>{t("patient.adresse")}</label>
            <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.consentGiven} onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })} />
              {" "}{t("patient.consent_patient_obtained")}
            </label>
          </div>
          <button type="submit" className="btn btn-primary">{t("patient.create_btn")}</button>
        </form>
      )}

      {loading ? (
        <div className="loading"><div className="spinner"></div>{t("patient.loading_records")}</div>
      ) : (
      <div className="patient-grid">
        {records.map((record) => (
          <div key={record.id} className="card patient-card" onClick={() => navigate(isPatient ? `/share/${record.id}` : `/patients/${record.id}`)}>
            <h3>{record.prenom} {record.nom}</h3>
            {record.dateNaissance && <p>{t("patient.born_on")} {new Date(record.dateNaissance).toLocaleDateString(locale)}</p>}
            {record.telephone && <p>{record.telephone}</p>}
            <span className={`consent-badge ${record.consentGiven ? "granted" : "denied"}`}>
              {record.consentGiven ? t("patient.consent_granted") : t("patient.consent_denied")}
            </span>
          </div>
        ))}
        {records.length === 0 && <p className="empty-state">{t("patient.no_records")}</p>}
      </div>
      )}
    </div>
  )
}
