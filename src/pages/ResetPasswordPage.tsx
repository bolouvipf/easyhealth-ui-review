import { useState, FormEvent } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { auth as authApi } from "../services/api"
import { useLanguage } from "../i18n/LanguageContext"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get("token") || ""
  const [token, setToken] = useState(tokenFromUrl)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { t, tb } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    if (newPassword !== confirmPassword) {
      setError(t("auth.reset_mismatch"))
      return
    }
    if (newPassword.length < 8) {
      setError(t("auth.reset_short"))
      return
    }
    try {
      const res = await authApi.resetPassword({ token, newPassword })
      setMessage(tb(res.message, "backend.reset_ok"))
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err: any) {
      setError(tb(err.response?.data?.message, "auth.reset_error"))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>EasyHealth</h1>
        <h2>{t("auth.reset_title")}</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {success ? (
          <p className="auth-link">{t("auth.reset_redirecting")}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("auth.reset_token_label")}</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)} required placeholder={t("auth.reset_token_placeholder")} />
            </div>
            <div className="form-group">
              <label>{t("auth.reset_new_password")}</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} placeholder={t("auth.reset_new_placeholder")} />
            </div>
            <div className="form-group">
              <label>{t("auth.reset_confirm_password")}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder={t("auth.reset_confirm_placeholder")} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">{t("auth.reset_btn")}</button>
          </form>
        )}
        <p className="auth-link">
          <Link to="/login">{t("auth.back_to_login")}</Link>
        </p>
      </div>
    </div>
  )
}
