import { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import { auth as authApi } from "../services/api"
import { useLanguage } from "../i18n/LanguageContext"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [resetLink, setResetLink] = useState("")
  const { t, tb } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setResetLink("")
    try {
      const res = await authApi.forgotPassword({ email })
      if (res.token) {
        const link = `${window.location.origin}/reset-password?token=${res.token}`
        setResetLink(link)
        setMessage(t("auth.forgot_dev_link"))
      } else {
        setMessage(tb(res.message, "auth.forgot_sent"))
      }
    } catch (err: any) {
      setError(tb(err.response?.data?.message, "auth.forgot_send_error"))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>EasyHealth</h1>
        <h2>{t("auth.forgot_title")}</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {resetLink && (
          <div className="alert alert-info">
            <p>{t("auth.forgot_link_label")}</p>
            <a href={resetLink} style={{ wordBreak: "break-all" }}>{resetLink}</a>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t("auth.forgot_btn")}</button>
        </form>
        <p className="auth-link">
          <Link to="/login">{t("auth.back_to_login")}</Link>
        </p>
      </div>
    </div>
  )
}
