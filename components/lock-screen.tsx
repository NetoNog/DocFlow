'use client'

import React, { useState } from 'react'
import {
  Lock,
  ArrowRight,
  BookOpen,
  LogOut,
  AlertCircle,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function LockScreen() {
  const { user, unlockSession, logout } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const success = unlockSession(password)
    if (!success) {
      setError('A senha inserida é inválida. Digite ao menos 3 caracteres.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1020]/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#5a50e5] text-white shadow-sm">
            <BookOpen className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a1c24]">
            doc<span className="text-[#5a50e5]">flow</span>
          </span>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex size-16 items-center justify-center rounded-full text-lg font-bold text-white shadow-md ${
              user.avatarColor || 'bg-[#5a50e5]'
            }`}
          >
            {user.avatarInitials}
          </div>

          <h2 className="mt-3 text-base font-bold text-[#1e232f]">{user.name}</h2>
          <p className="text-xs text-[#71788a]">{user.email}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 border border-amber-200">
            <Lock className="size-3 text-amber-600" />
            <span>Sessão bloqueada por segurança</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="mt-5 space-y-3">
          <div>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Digite sua senha ou PIN"
                className="block h-10 w-full rounded-xl border border-[#d0d4dc] bg-[#f8f9fa] px-3.5 text-xs text-[#1e232f] placeholder:text-[#9ca3af] focus:border-[#5a50e5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
              />
            </div>
            <p className="mt-1 text-[10px] text-[#9ca3af] text-center">
              Dica para teste: qualquer senha com 3 ou mais caracteres desbloqueia.
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5a50e5] py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db] transition active:scale-[0.98]"
          >
            <span>Desbloquear Workspace</span>
            <ArrowRight className="size-3.5" />
          </button>
        </form>

        {/* Switch Account / Logout */}
        <div className="mt-6 border-t border-[#f0f2f5] pt-4 text-center">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71788a] hover:text-red-600 transition"
          >
            <LogOut className="size-3.5" />
            <span>Sair ou trocar de conta</span>
          </button>
        </div>
      </div>
    </div>
  )
}
