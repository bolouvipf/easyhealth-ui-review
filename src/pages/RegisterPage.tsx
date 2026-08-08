import { useState, FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { auth as authApi, setStoredRefreshToken } from "../services/api"
import { useAuth } from "../hooks/useAuth"
import { useLanguage } from "../i18n/LanguageContext"

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", nom: "", prenom: "", role: "patient", telephone: "", professionalLicenseNumber: "", establishment: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const { t, tb } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      if (form.role !== "patient") {
        if (!form.professionalLicenseNumber.trim()) {
          setError(t("auth.license_required"))
          setLoading(false)
          return
        }
        if (!form.establishment.trim()) {
          setError(t("auth.establishment_required"))
          setLoading(false)
          return
        }
      }
      const response = await authApi.register(form)
      localStorage.setItem("easyhealth_token", response.accessToken)
      localStorage.setItem("easyhealth_user", JSON.stringify(response.user))
      localStorage.setItem("easyhealth_refresh", response.refreshToken)
      setStoredRefreshToken(response.refreshToken)
      setToken(response.accessToken)
      setUser(response.user)
      if (response.user.role !== "patient" && response.user.professionalStatus === "pending") {
        setSuccess(t("auth.pending_success"))
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      setError(tb(err.response?.data?.message, "auth.register_error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>EasyHealth</h1>
        <h2>{t("auth.register_title")}</h2>
        <div className="alert alert-info" style={{ fontSize: "0.85rem" }}>
          {t("demo.banner_text")}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {success ? (
          <div>
            <div className="alert alert-success">{success}</div>
            <p className="auth-link">
              <Link to="/login">{t("auth.login_btn")}</Link>
            </p>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t("auth.nom")}</label>
              <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>{t("auth.prenom")}</label>
              <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t("auth.password_min")}</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>{t("auth.role")}</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="patient">{t("roles.patient")}</option>
              <option value="medecin">{t("roles.medecin")}</option>
              <option value="infirmier">{t("roles.infirmier")}</option>
              <option value="agent_communautaire">{t("roles.agent_communautaire")}</option>
              <option value="administratif">{t("roles.administratif")}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t("auth.phone")}</label>
            <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
          </div>

          {form.role !== "patient" && (
            <>
              <div className="form-group">
                <label>{t("auth.license_label")}</label>
                <input
                  value={form.professionalLicenseNumber}
                  onChange={(e) => setForm({ ...form, professionalLicenseNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("auth.establishment_label")}</label>
                <input
                  value={form.establishment}
                  onChange={(e) => setForm({ ...form, establishment: e.target.value })}
                  required
                  placeholder={t("auth.establishment_placeholder")}
                />
              </div>
            </>
          )}
          <button type="submit" className={`btn btn-primary btn-block${loading ? " btn-loading" : ""}`} disabled={loading}>{t("auth.register_btn")}</button>
        </form>
        )}
        <p className="auth-link">
          {t("auth.login_link")} <Link to="/login">{t("auth.login_btn")}</Link>
        </p>
      </div>
    </div>
  )
}
