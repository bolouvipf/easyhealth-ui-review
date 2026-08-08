import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { sharing as sharingApi, patients as patientsApi } from "../services/api"
import { useLanguage } from "../i18n/LanguageContext"
import type { SharingCodeResponse } from "../types"

export default function SharePage() {
  const { id } = useParams<{ id: string }>()
  const [code, setCode] = useState<SharingCodeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [recordName, setRecordName] = useState("")
  const { t, locale } = useLanguage()

  useEffect(() => {
    if (id) patientsApi.findOne(id).then((r) => setRecordName(`${r.prenom} ${r.nom}`)).catch(console.error)
  }, [id])

  const generateCode = async () => {
    if (!id) return
    setLoading(true)
    try {
      const result = await sharingApi.generateCode({ patientRecordId: id, expiresInMinutes: 30 })
      setCode(result)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    if (code) navigator.clipboard.writeText(code.code)
  }

  return (
    <div className="share-page">
      <h1>{t("share.title")}</h1>
      {recordName && <p className="share-patient-name">{t("share.record_of")} <strong>{recordName}</strong></p>}

      <div className="card share-card">
        <h2>{t("share.card_title")}</h2>
        <p>{t("share.card_desc")}</p>
        <p className="share-info">{t("share.card_info")}</p>

        {code ? (
          <div className="code-display">
            <div className="big-code">{code.code}</div>
            <p className="expires-at">{t("share.expires_at", { time: new Date(code.expiresAt).toLocaleTimeString(locale) })}</p>
            <div className="share-actions">
              <button className="btn btn-primary" onClick={copyToClipboard}>{t("share.copy_code")}</button>
              <button className="btn btn-secondary" onClick={generateCode}>{t("share.new_code")}</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary btn-block" onClick={generateCode} disabled={loading}>
            {loading ? t("share.generating") : t("share.generate_btn")}
          </button>
        )}
      </div>

      <div className="card">
        <h3>{t("share.instructions")}</h3>
        <ol>
          <li>{t("share.step1")}</li>
          <li>{t("share.step2")}</li>
          <li>{t("share.step3")}</li>
          <li>{t("share.step4")}</li>
        </ol>
        <p className="share-note">{t("share.urgency_note")}</p>
      </div>
    </div>
  )
}
