import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { auth as authApi, setStoredRefreshToken } from "../services/api"
import { demoUsers } from "../mock/data"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_USER = "demo_easyhealth_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_USER)
    if (saved) {
      setUser(JSON.parse(saved))
      setToken("demo-access-token")
    } else {
      const defaultUser = demoUsers["medecin@demo.tg"]
      localStorage.setItem(STORAGE_USER, JSON.stringify(defaultUser))
      setUser(defaultUser)
      setToken("demo-access-token")
    }
    setIsLoading(false)
  }, [])

  const doLogout = () => {
    localStorage.removeItem(STORAGE_USER)
    setStoredRefreshToken(null)
    setToken(null)
    setUser(null)
    window.location.hash = "#/login"
  }

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem(STORAGE_USER, JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: any) => {
    const response = await authApi.register(data)
    localStorage.setItem(STORAGE_USER, JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  const adminLogin = useCallback(async (email: string, password: string) => {
    const response = await authApi.adminLogin({ email, password })
    localStorage.setItem(STORAGE_USER, JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    doLogout()
  }, [])

  const logoutAll = useCallback(async () => {
    await authApi.logoutAll()
    doLogout()
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, adminLogin, register, logout, logoutAll, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export function triggerLogout() {
  window.location.hash = "#/login"
}
