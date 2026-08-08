import {
  demoUsers,
  adminUser,
  patients as patientRecords,
  clinicalEntries,
  auditLogs,
  adminStats,
  adminUsers,
  pendingProfessionals,
  dashboardStats,
  shareCode,
} from "../mock/data"
import type { PatientRecord, ClinicalEntry, User, ProfessionalStatus } from "../types"

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

let refreshTokenStore: string | null = localStorage.getItem("easyhealth_refresh") || null

export function setStoredRefreshToken(t: string | null) {
  refreshTokenStore = t
  if (t) localStorage.setItem("easyhealth_refresh", t)
  else localStorage.removeItem("easyhealth_refresh")
}

export function getStoredRefreshToken() {
  return refreshTokenStore
}

export function setLogoutHandler(_fn: () => void) {}

export function isDemoMode() {
  return true
}

const DEMO_PASSWORD = "demo1234"

export const auth = {
  register: async (data: any) => {
    await delay()
    const email = data.email
    const role = data.role || "patient"
    const user = role === "admin" ? { ...adminUser, email } : {
      id: `u-${Date.now()}`,
      email,
      nom: data.nom || "Utilisateur",
      prenom: data.prenom || "Nouveau",
      role,
      telephone: data.telephone,
      professionalLicenseNumber: data.professionalLicenseNumber,
      professionalStatus: "pending" as ProfessionalStatus,
      isActive: true,
      consentGiven: true,
    }
    localStorage.setItem("easyhealth_user", JSON.stringify(user))
    const accessToken = "demo-access-token"
    const refreshToken = "demo-refresh-token"
    setStoredRefreshToken(refreshToken)
    return { user, accessToken, refreshToken }
  },
  login: async (data: any) => {
    await delay()
    let user = demoUsers[data.email]
    if (!user) user = { ...demoUsers["patient@demo.tg"], email: data.email }
    if (data.password !== DEMO_PASSWORD && data.password !== "admin1234") {
      throw new Error("Identifiants invalides (utilisez le mot de passe de démo)")
    }
    localStorage.setItem("easyhealth_user", JSON.stringify(user))
    const accessToken = "demo-access-token"
    const refreshToken = "demo-refresh-token"
    setStoredRefreshToken(refreshToken)
    return { user, accessToken, refreshToken }
  },
  adminLogin: async (data: any) => {
    await delay()
    localStorage.setItem("easyhealth_user", JSON.stringify(adminUser))
    return { user: adminUser, accessToken: "demo-access-token", refreshToken: "demo-refresh-token" }
  },
  me: async () => {
    await delay()
    const saved = localStorage.getItem("easyhealth_user")
    return saved ? JSON.parse(saved) : adminUser
  },
  forgotPassword: async (_data: any) => {
    await delay()
    return { message: "Si cet email existe, un lien de réinitialisation a été envoyé." } as { message: string; token?: string }
  },
  resetPassword: async (_data: any) => {
    await delay()
    return { message: "Mot de passe réinitialisé avec succès" }
  },
  refresh: async () => ({ accessToken: "demo-access-token", refreshToken: "demo-refresh-token" }),
  logout: async () => {
    await delay(100)
    return {}
  },
  logoutAll: async () => {
    await delay(100)
    return {}
  },
}

export const patients = {
  findAll: async (): Promise<PatientRecord[]> => {
    await delay()
    return patientRecords
  },
  findAllPaginated: async () => ({ data: patientRecords, total: patientRecords.length, page: 1, limit: 20 }),
  findOne: async (id: string): Promise<PatientRecord> => {
    await delay()
    const record = patientRecords.find((p) => p.id === id)
    if (!record) throw new Error("Dossier introuvable")
    return { ...record, clinicalEntries: clinicalEntries[id] || [] }
  },
  findMine: async (): Promise<PatientRecord[]> => {
    await delay()
    return patientRecords.slice(0, 2)
  },
  create: async (data: any): Promise<PatientRecord> => {
    await delay()
    const record: PatientRecord = {
      id: `p-${Date.now()}`,
      nom: data.nom,
      prenom: data.prenom,
      dateNaissance: data.dateNaissance,
      sexe: data.sexe,
      groupeSanguin: data.groupeSanguin,
      telephone: data.telephone,
      adresse: data.adresse,
      profession: data.profession,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      isActive: true,
      createdById: "u-med1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    patientRecords.unshift(record)
    clinicalEntries[record.id] = []
    return record
  },
  update: async (id: string, data: any): Promise<PatientRecord> => {
    await delay()
    const record = patientRecords.find((p) => p.id === id)
    if (!record) throw new Error("Dossier introuvable")
    Object.assign(record, data)
    record.updatedAt = new Date().toISOString()
    return record
  },
  remove: async () => {
    await delay()
    return {}
  },
  addClinicalEntry: async (id: string, data: any): Promise<ClinicalEntry> => {
    await delay()
    const entry: ClinicalEntry = {
      id: `e-${Date.now()}`,
      patientRecordId: id,
      authorId: "u-med1",
      entryType: data.entryType || "consultation",
      content: data.content,
      specialty: data.specialty,
      createdAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
    }
    if (!clinicalEntries[id]) clinicalEntries[id] = []
    clinicalEntries[id].unshift(entry)
    return entry
  },
  getClinicalEntries: async (id: string): Promise<ClinicalEntry[]> => {
    await delay()
    return clinicalEntries[id] || []
  },
  getClinicalEntriesPaginated: async (id: string) => ({
    data: clinicalEntries[id] || [],
    total: (clinicalEntries[id] || []).length,
    page: 1,
    limit: 20,
  }),
}

export const sharing = {
  generateCode: async (data: any) => {
    await delay()
    const expiresAt = new Date(Date.now() + (data.expiresInMinutes || 30) * 60000).toISOString()
    return { ...shareCode, expiresAt }
  },
  accessByCode: async (code: string) => {
    await delay()
    if (code.trim().toUpperCase() !== shareCode.code) throw new Error("Code invalide ou expiré")
    return { ...patientRecords[0], clinicalEntries: clinicalEntries["p-1"] || [] }
  },
  getCodes: async () => [shareCode],
}

export const audit = {
  findAll: async () => {
    await delay()
    return auditLogs
  },
  findByPatient: async () => {
    await delay()
    return auditLogs
  },
  findByUser: async () => {
    await delay()
    return auditLogs
  },
}

export const professionals = {
  findPending: async () => {
    await delay()
    return pendingProfessionals
  },
  verify: async (id: string) => {
    await delay()
    return { id, status: "verified" }
  },
  reject: async (id: string, reason: string) => {
    await delay()
    return { id, status: "rejected", reason }
  },
}

export const admin = {
  getStats: async () => {
    await delay()
    return adminStats
  },
  getUsers: async () => {
    await delay()
    return adminUsers.map((u) => ({
      ...u,
      createdAt: "2025-10-01T09:00:00.000Z",
    }))
  },
  toggleUserActive: async (id: string) => {
    await delay()
    const user = adminUsers.find((u) => u.id === id)
    if (user) {
      user.isActive = !user.isActive
      return {
        ...user,
        createdAt: "2025-10-01T09:00:00.000Z",
      }
    }
    throw new Error("Utilisateur introuvable")
  },
}

export const dashboard = {
  getDashboard: async () => {
    await delay()
    return dashboardStats
  },
}
