'use client'

import React, { useState } from 'react'
import {
  X,
  User,
  Shield,
  KeyRound,
  QrCode,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Save,
  Building,
  Mail,
  Phone,
  Eye,
  EyeOff,
  History,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const AVATAR_COLORS = [
  { name: 'Índigo Padrão', class: 'bg-[#5a50e5]' },
  { name: 'Esmeralda', class: 'bg-emerald-600' },
  { name: 'Azul Real', class: 'bg-blue-600' },
  { name: 'Âmbar', class: 'bg-amber-600' },
  { name: 'Violeta', class: 'bg-purple-600' },
  { name: 'Grafite', class: 'bg-slate-700' },
]

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile } = useAuth()

  const [activeTab, setActiveTab] = useState<'info' | 'security' | '2fa' | 'history'>('info')

  // Personal Info Form
  const [name, setName] = useState(user?.name || '')
  const [department, setDepartment] = useState(user?.department || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || 'bg-[#5a50e5]')

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)

  // 2FA Form
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? false)
  const [totpCode, setTotpCode] = useState('')

  // Feedback Alert
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null)

  if (!isOpen || !user) return null

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name: name.trim(),
      department: department.trim(),
      phone: phone.trim(),
      avatarColor,
      avatarInitials: name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || user.avatarInitials,
    })
    setFeedbackSuccess('Perfil atualizado com sucesso!')
    setTimeout(() => setFeedbackSuccess(null), 2500)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPassError(null)

    if (newPassword.length < 6) {
      setPassError('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('A confirmação de senha não coincide com a nova senha.')
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setFeedbackSuccess('Senha de acesso alterada com sucesso!')
    setTimeout(() => setFeedbackSuccess(null), 3000)
  }

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled
    setTwoFactorEnabled(nextState)
    updateProfile({ twoFactorEnabled: nextState })
    setFeedbackSuccess(
      nextState
        ? 'Autenticação em Dois Fatores ativada com sucesso!'
        : 'Autenticação em Dois Fatores desativada.'
    )
    setTimeout(() => setFeedbackSuccess(null), 3000)
  }

  // Password Strength Calculator
  const getPasswordStrength = () => {
    if (!newPassword) return null
    if (newPassword.length < 6) return { label: 'Fraca', color: 'bg-red-500', width: 'w-1/4' }
    if (newPassword.length < 10) return { label: 'Média', color: 'bg-amber-500', width: 'w-2/4' }
    return { label: 'Forte & Segura', color: 'bg-emerald-500', width: 'w-full' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex h-full max-h-[640px] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e8eaee] px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${avatarColor}`}
            >
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1e232f]">{user.name}</h3>
                <span className="rounded-md bg-[#edeefc] px-2 py-0.5 text-[10px] font-bold text-[#5a50e5] border border-[#dcd7fe]">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#71788a]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#98a0b0] hover:bg-[#f1f2f5] hover:text-[#525866]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 px-6 py-2.5 text-xs font-semibold text-emerald-800 border-b border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>{feedbackSuccess}</span>
          </div>
        )}

        {/* Sub-Tabs Navigation */}
        <div className="flex border-b border-[#e8eaee] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition ${
              activeTab === 'info'
                ? 'border-[#5a50e5] text-[#5a50e5]'
                : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
            }`}
          >
            <User className="size-3.5" />
            <span>Dados Pessoais</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition ${
              activeTab === 'security'
                ? 'border-[#5a50e5] text-[#5a50e5]'
                : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
            }`}
          >
            <KeyRound className="size-3.5" />
            <span>Senha & Segurança</span>
          </button>

          <button
            onClick={() => setActiveTab('2fa')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition ${
              activeTab === '2fa'
                ? 'border-[#5a50e5] text-[#5a50e5]'
                : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
            }`}
          >
            <Shield className="size-3.5" />
            <span>2FA (MFA)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition ${
              activeTab === 'history'
                ? 'border-[#5a50e5] text-[#5a50e5]'
                : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
            }`}
          >
            <History className="size-3.5" />
            <span>Histórico de Acessos</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#e1e4ea] bg-[#f8f9fa] px-3.5 text-xs text-[#71788a] cursor-not-allowed"
                  />
                  <p className="mt-1 text-[10px] text-[#9ca3af]">
                    Gerenciado pelo Administrador do Workspace
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Telefone Corporativo
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">Departamento</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">Papel Atual</label>
                  <input
                    type="text"
                    disabled
                    value={user.role}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#e1e4ea] bg-[#f8f9fa] px-3.5 text-xs font-semibold text-[#5a50e5] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#3b4050] mb-2">
                  Cor do Avatar de Iniciais
                </label>
                <div className="flex gap-2.5">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setAvatarColor(c.class)}
                      title={c.name}
                      className={`size-7 rounded-full transition-transform ${c.class} ${
                        avatarColor === c.class
                          ? 'ring-2 ring-offset-2 ring-[#5a50e5] scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5a50e5] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  <Save className="size-3.5" />
                  <span>Salvar Dados</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: SECURITY / PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{passError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">Senha Atual</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">Nova Senha</label>
                <div className="relative mt-1">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="block h-10 w-full rounded-lg border border-[#d0d4dc] pl-3.5 pr-10 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9ca3af] hover:text-[#525866]"
                  >
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Strength Bar */}
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
                    </div>
                    <p className="mt-1 text-[10px] text-[#71788a]">
                      Força da senha: <strong className="text-[#1e232f]">{strength.label}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Confirmar Nova Senha
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5a50e5] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  <KeyRound className="size-3.5" />
                  <span>Atualizar Senha</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: 2FA */}
          {activeTab === '2fa' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-[#e8eaee] bg-[#fbfbfc] p-4">
                <div>
                  <h4 className="text-xs font-bold text-[#1e232f]">
                    Autenticação em Dois Fatores (2FA)
                  </h4>
                  <p className="mt-0.5 text-[11px] text-[#71788a]">
                    Exige um código de segurança temporário além da senha no momento do login.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    twoFactorEnabled
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
                </button>
              </div>

              {twoFactorEnabled ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-800">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>2FA está ativado e protegendo sua conta</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    Seu aplicativo autenticador (Google Authenticator, Microsoft Authenticator ou 1Password) está pareado.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#e8eaee] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edeefc] text-[#5a50e5]">
                      <Smartphone className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1e232f]">
                        Parear Aplicativo Autenticador
                      </h4>
                      <p className="text-[11px] text-[#71788a]">
                        Escaneie a chave corporativa no seu aplicativo de preferência.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#f8f9fa] p-3 text-center border border-[#e8eaee]">
                    <div className="mx-auto size-28 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center">
                      <QrCode className="size-20 text-[#1e232f]" />
                    </div>
                    <p className="mt-2 font-mono text-[11px] font-semibold text-[#5a50e5]">
                      DOCFLOW-AUTH-7X89-KL42
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ACCESS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#1e232f]">Últimos Acessos ao Workspace</h4>
              <div className="divide-y divide-[#f0f2f5] rounded-xl border border-[#e8eaee] bg-white">
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <Laptop className="size-4 text-[#5a50e5]" />
                    <div>
                      <p className="text-xs font-semibold text-[#1e232f]">
                        Chrome em Windows 11 (Sessão Atual)
                      </p>
                      <p className="text-[10px] text-[#71788a]">São Paulo, Brasil • IP 177.18.92.14</p>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Agora
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-4 text-[#798094]" />
                    <div>
                      <p className="text-xs font-semibold text-[#1e232f]">
                        Safari no iPhone 15 Pro
                      </p>
                      <p className="text-[10px] text-[#71788a]">São Paulo, Brasil • IP 177.18.92.14</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#71788a]">Hoje, 09:12</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <Laptop className="size-4 text-[#798094]" />
                    <div>
                      <p className="text-xs font-semibold text-[#1e232f]">
                        Edge em Windows 11
                      </p>
                      <p className="text-[10px] text-[#71788a]">São Paulo, Brasil • IP 189.44.12.8</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#71788a]">Ontem, 16:40</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-[#e8eaee] bg-[#f9fafb] px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d0d4dc] bg-white px-4 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
