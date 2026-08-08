import { useState, useEffect } from "react"
import { professionals as professionalsApi, admin as adminApi } from "../services/api"
import { useLanguage } from "../i18n/LanguageContext"

interface PendingProfessional {
  id: string
  userId: string
  licenseNumber: string
  establishment?: string
  status: string
  user?: { nom: string; prenom: string; email: string; role: string; telephone?: string }
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingProfessionals: number
  totalPatients: number
  usersByRole: Array<{ role: string; count: number }>
}

interface AdminUser {
  id: string
  email: string
  nom: string
  prenom: string
  role: string
  professionalStatus: string
  isActive: boolean
  createdAt: string
}

type Tab = "dashboard" | "users" | "verifications"

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard")
  const [pending, setPending] = useState<PendingProfessional[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [s, p, u] = await Promise.all([
          adminApi.getStats(),
          professionalsApi.findPending(),
          adminApi.getUsers(),
        ])
        setStats(s)
        setPending(p)
        setUsers(u)
      } catch {
        setError(t("admin.load_error"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleVerify = async (id: string) => {
    try {
      await professionalsApi.verify(id)
      setPending(pending.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt(t("admin.reject_reason"))
    if (!reason) return
    try {
      await professionalsApi.reject(id, reason)
      setPending(pending.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const updated = await adminApi.toggleUserActive(id)
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)))
    } catch (err) {
      console.error(err)
    }
  }

  const roleLabel = (role: string) => t(`roles.${role}`) ?? role

  return (
    <div className="admin-shell">
      <div className="page-header">
        <div>
          <h1>{t("admin.title")}</h1>
          <p className="page-subtitle">
            {t("admin.subtitle")}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="empty-state">{t("admin.loading")}</p>}

      <div className="admin-tabs">
        <button className={`tab ${tab === "dashboard" ? "is-active" : ""}`} onClick={() => setTab("dashboard")}>{t("admin.tab_dashboard")}</button>
        <button className={`tab ${tab === "users" ? "is-active" : ""}`} onClick={() => setTab("users")}>{t("admin.tab_users")}</button>
        <button className={`tab ${tab === "verifications" ? "is-active" : ""}`} onClick={() => setTab("verifications")}>
          {t("admin.tab_verifications")}
          {pending.length > 0 && <span className="tab-badge">{pending.length}</span>}
        </button>
      </div>

      {tab === "dashboard" && stats && (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">{t("admin.stat_users")}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{stats.activeUsers}</div>
              <div className="stat-label">{t("admin.stat_active")}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{stats.totalPatients}</div>
              <div className="stat-label">{t("admin.stat_records")}</div>
            </div>
            <div className="card stat-card is-warning">
              <div className="stat-value">{stats.pendingProfessionals}</div>
              <div className="stat-label">{t("admin.stat_pending")}</div>
            </div>
          </div>

          <div className="admin-dash-grid">
            <div className="card">
              <div className="card-head">
                <h2>{t("admin.role_breakdown")}</h2>
              </div>
              <div className="role-breakdown">
                {stats.usersByRole.map((r) => (
                  <div key={r.role} className="role-row">
                    <span className="role-name">{roleLabel(r.role)}</span>
                    <div className="role-bar-wrapper">
                      <div className="role-bar" style={{ width: `${(r.count / stats.totalUsers) * 100}%` }} />
                    </div>
                    <span className="role-count">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card task-card">
              <div className="card-head">
                <h2>{t("admin.to_process")}</h2>
              </div>
              <div className="task-value">{pending.length}</div>
              <p>{t("admin.pending_count")}</p>
              <button className="btn btn-primary btn-sm" onClick={() => setTab("verifications")}>
                {t("admin.process_requests")}
              </button>
            </div>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="card">
          <div className="card-head">
            <h2>{t("admin.user_management")}</h2>
            <span className="muted-count">{t("admin.total_count", { count: users.length })}</span>
          </div>
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>{t("admin.th_name")}</th>
                  <th>{t("admin.th_email")}</th>
                  <th>{t("admin.th_role")}</th>
                  <th>{t("admin.th_status")}</th>
                  <th>{t("admin.th_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.prenom} {u.nom}</td>
                    <td>{u.email}</td>
                    <td>{roleLabel(u.role)}</td>
                    <td>
                      <span className={`status-badge ${u.isActive ? "status-active" : "status-inactive"}`}>
                        {u.isActive ? t("admin.status_active") : t("admin.status_inactive")}
                      </span>
                      {u.professionalStatus === "pending" && <span className="status-badge status-pending">{t("admin.status_pending")}</span>}
                    </td>
                    <td>
                      <button className={`btn btn-sm ${u.isActive ? "btn-danger" : "btn-success"}`} onClick={() => handleToggleActive(u.id)}>
                        {u.isActive ? t("admin.btn_disable") : t("admin.btn_enable")}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="empty-state">{t("admin.no_users")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "verifications" && (
        <div className="card">
          <div className="card-head">
            <h2>{t("admin.verification_title")}</h2>
            <span className="muted-count">{t("admin.pending_count_suffix", { count: pending.length })}</span>
          </div>
          {pending.length === 0 ? (
            <p className="empty-state">{t("admin.no_pending")}</p>
          ) : (
            <div className="audit-table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>{t("admin.th_name")}</th>
                    <th>{t("admin.th_email")}</th>
                    <th>{t("admin.th_phone")}</th>
                    <th>{t("admin.th_role")}</th>
                    <th>{t("admin.th_license")}</th>
                    <th>{t("admin.th_establishment")}</th>
                    <th>{t("admin.th_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                      <tr key={p.id}>
                        <td>{p.user ? `${p.user.prenom} ${p.user.nom}` : "—"}</td>
                        <td>{p.user?.email || "—"}</td>
                        <td>{p.user?.telephone || "—"}</td>
                        <td>{roleLabel(p.user?.role || "")}</td>
                        <td>{p.licenseNumber}</td>
                        <td>{p.establishment || "—"}</td>
                        <td className="action-cells">
                        <button className="btn btn-success btn-sm" onClick={() => handleVerify(p.id)}>{t("admin.btn_verify")}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(p.id)}>{t("admin.btn_reject")}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
