interface Props {
  onFill: (email: string, password: string) => void
  admin?: boolean
}

const ACCOUNTS = (admin: boolean) =>
  admin
    ? [{ email: "admin@demo.tg", password: "admin1234", label: "Administrateur" }]
    : [
        { email: "medecin@demo.tg", password: "demo1234", label: "Médecin" },
        { email: "infirmier@demo.tg", password: "demo1234", label: "Infirmier" },
        { email: "agent@demo.tg", password: "demo1234", label: "Agent communautaire" },
        { email: "patient@demo.tg", password: "demo1234", label: "Patient" },
      ]

export default function DemoCredentials({ onFill, admin }: Props) {
  return (
    <div className="demo-creds">
      <div className="demo-creds-head">
        <span className="demo-pill">MODE DÉMO</span>
        <strong>Comptes de démonstration</strong>
        <span>Aucune donnée réelle. Cliquez pour remplir le formulaire.</span>
      </div>
      <div className="demo-creds-list">
        {ACCOUNTS(!!admin).map((a) => (
          <button key={a.email} type="button" className="demo-cred" onClick={() => onFill(a.email, a.password)}>
            <span className="demo-cred-role">{a.label}</span>
            <span className="demo-cred-email">{a.email}</span>
            <span className="demo-cred-hint">mot de passe : {a.password}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
