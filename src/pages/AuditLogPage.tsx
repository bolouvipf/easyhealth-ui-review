import { useState, useEffect } from "react"
import { audit as auditApi } from "../services/api"
import { useLanguage } from "../i18n/LanguageContext"
import type { AuditLog } from "../types"

const actionKeys = ["consultation", "creation", "modification", "suppression", "partage", "export", "connexion"]

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filter, setFilter] = useState("")
  const { t, locale } = useLanguage()

  useEffect(() => {
    auditApi.findAll().then(setLogs).catch(console.error)
  }, [])

  const filtered = filter ? logs.filter((l) => l.action === filter) : logs

  return (
    <div>
      <div className="page-header">
        <h1>{t("audit.title")}</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">{t("audit.all_actions")}</option>
          {actionKeys.map((key) => (
            <option key={key} value={key}>{t(`audit_actions.${key}`)}</option>
          ))}
        </select>
      </div>

      <div className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>{t("audit.date")}</th>
              <th>{t("audit.action")}</th>
              <th>{t("audit.user")}</th>
              <th>{t("audit.details")}</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString(locale)}</td>
                <td><span className={`action-badge action-${log.action}`}>{t(`audit_actions.${log.action}`) || log.action}</span></td>
                <td>{log.user ? `${log.user.prenom} ${log.user.nom}` : log.userId || "—"}</td>
                <td>{log.details || "—"}</td>
                <td>{log.ipAddress || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-state">{t("audit.no_logs")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
