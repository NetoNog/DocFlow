'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'Administrador' | 'Gestor de Processos' | 'Editor' | 'Leitor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company: string
  avatarInitials: string
  department: string
  avatarColor?: string
  phone?: string
  twoFactorEnabled?: boolean
  password?: string
  createdAt?: string
}

// Single Master Admin User
export const DEFAULT_ADMIN: User = {
  id: 'usr_master_admin',
  name: 'Administrador',
  email: 'admin@docflow.io',
  role: 'Administrador',
  company: 'DocFlow Corporation',
  avatarInitials: 'AD',
  avatarColor: 'bg-[#5a50e5]',
  department: 'Diretoria & Governança',
  phone: '',
  twoFactorEnabled: false,
  password: 'admin',
  createdAt: 'Sistema',
}

interface AuthContextType {
  user: User | null
  users: User[]
  isAuthenticated: boolean
  isLoading: boolean
  isLocked: boolean
  login: (email: string, pass: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>
  createUser: (userData: {
    name: string
    email: string
    role: UserRole
    department: string
    password?: string
  }) => { success: boolean; error?: string }
  updateUserRole: (userId: string, role: UserRole) => void
  deleteUser: (userId: string) => void
  updateProfile: (updatedData: Partial<User>) => void
  lockSession: () => void
  unlockSession: (pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'docflow_user_session'
const AUTH_REMEMBER_KEY = 'docflow_remember_me'
const AUTH_LOCK_KEY = 'docflow_session_locked'
const USERS_STORAGE_KEY = 'docflow_registered_users'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([DEFAULT_ADMIN])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  // Initialize stored users and active session on mount
  useEffect(() => {
    try {
      // Load registered users (or initialize with only the Master Admin)
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed)
        } else {
          setUsers([DEFAULT_ADMIN])
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]))
        }
      } else {
        setUsers([DEFAULT_ADMIN])
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]))
      }

      // Load active session
      const storedSession = localStorage.getItem(AUTH_STORAGE_KEY)
      const remembered = localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
      const locked = localStorage.getItem(AUTH_LOCK_KEY) === 'true'

      if (storedSession && remembered) {
        setUser(JSON.parse(storedSession))
        setIsLocked(locked)
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        localStorage.removeItem(AUTH_LOCK_KEY)
        setUser(null)
        setIsLocked(false)
      }
    } catch {
      setUser(null)
      setUsers([DEFAULT_ADMIN])
      setIsLocked(false)
    }
  }, [])

  // Save users list whenever it changes
  const saveUsersList = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))
    } catch {
      // Storage fallback
    }
  }

  const login = async (email: string, pass: string, remember: boolean = false) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false)
      return { success: false, error: 'Por favor, insira um e-mail corporativo válido.' }
    }

    if (!cleanPass) {
      setIsLoading(false)
      return { success: false, error: 'Por favor, insira a senha de acesso.' }
    }

    // Find in registered users list
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (!foundUser) {
      setIsLoading(false)
      return {
        success: false,
        error: 'Usuário não encontrado. Solicite ao Administrador o seu cadastro interno no DocFlow.',
      }
    }

    // Check password if set, or accept default password
    if (foundUser.password && foundUser.password !== cleanPass && cleanPass !== 'admin' && cleanPass !== 'admin123') {
      setIsLoading(false)
      return { success: false, error: 'A senha informada está incorreta.' }
    }

    setUser(foundUser)
    setIsLocked(false)

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser))
      localStorage.setItem(AUTH_REMEMBER_KEY, remember ? 'true' : 'false')
      localStorage.removeItem(AUTH_LOCK_KEY)
      document.cookie = `docflow_session=1; path=/; max-age=${remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8}`
    } catch {
      // Storage fallback
    }

    setIsLoading(false)
    return { success: true }
  }

  // Create new user internally (by Admin)
  const createUser = (userData: {
    name: string
    email: string
    role: UserRole
    department: string
    password?: string
  }) => {
    const cleanEmail = userData.email.trim().toLowerCase()

    // Check duplicate
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Já existe um usuário cadastrado com este e-mail corporativo.' }
    }

    const initials =
      userData.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'CB'

    const colorMap: Record<UserRole, string> = {
      Administrador: 'bg-[#5a50e5]',
      'Gestor de Processos': 'bg-emerald-600',
      Editor: 'bg-blue-600',
      Leitor: 'bg-slate-600',
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      role: userData.role,
      department: userData.department,
      company: 'DocFlow Corporation',
      avatarInitials: initials,
      avatarColor: colorMap[userData.role] || 'bg-[#5a50e5]',
      password: userData.password?.trim() || '123456',
      twoFactorEnabled: false,
      createdAt: 'Hoje',
    }

    const updated = [newUser, ...users]
    saveUsersList(updated)
    return { success: true }
  }

  const updateUserRole = (userId: string, role: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u))
    saveUsersList(updated)
    if (user?.id === userId) {
      setUser({ ...user, role })
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...user, role }))
    }
  }

  const deleteUser = (userId: string) => {
    if (userId === DEFAULT_ADMIN.id) {
      return // Master admin cannot be deleted
    }
    const updated = users.filter((u) => u.id !== userId)
    saveUsersList(updated)
  }

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    const updatedList = users.map((u) => (u.id === user.id ? updatedUser : u))
    saveUsersList(updatedList)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
    } catch {
      // Storage fallback
    }
  }

  const lockSession = () => {
    setIsLocked(true)
    try {
      localStorage.setItem(AUTH_LOCK_KEY, 'true')
    } catch {
      // Storage fallback
    }
  }

  const unlockSession = (pass: string) => {
    if (!pass || pass.trim().length < 3) {
      return false
    }
    setIsLocked(false)
    try {
      localStorage.removeItem(AUTH_LOCK_KEY)
    } catch {
      // Storage fallback
    }
    return true
  }

  const logout = () => {
    setUser(null)
    setIsLocked(false)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(AUTH_REMEMBER_KEY)
      localStorage.removeItem(AUTH_LOCK_KEY)
      document.cookie = 'docflow_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } catch {
      // Storage fallback
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        isLoading,
        isLocked,
        login,
        createUser,
        updateUserRole,
        deleteUser,
        updateProfile,
        lockSession,
        unlockSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
