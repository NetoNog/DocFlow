'use client'

import React, { useState } from 'react'
import {
  Building2,
  Bell,
  Shield,
  Save,
  Check,
  Globe,
  Clock,
  Laptop,
  Smartphone,
  KeyRound,
  Download,
  AlertTriangle,
  Lock,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function SettingsView() {
  const { user } = useAuth()

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'notifications' | 'security'>('general')

  // General Settings State
  const [workspaceName, setWorkspaceName] = useState('DocFlow Corporation')
  const [slug, setSlug] = useState('docflow-corp')
  const [timezone, setTimezone] = useState('America/Sao_Paulo (GMT-03:00)')
  const [language, setLanguage] = useState('pt-BR')
  const [supportEmail, setSupportEmail] = useState('governança@docflow.io')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Notification Toggles
  const [notifApprovals, setNotifApprovals] = useState(true)
  const [notifNewDocs, setNotifNewDocs] = useState(true)
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(false)
  const [notifExpiring, setNotifExpiring] = useState(true)

  // Security Toggles
  const [require2FA, setRequire2FA] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('8')
  const [passwordRotation, setPasswordRotation] = useState('90')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1c24] sm:text-[28px]">
            Configurações do Workspace
          </h1>
          <p className="mt-1 text-xs text-[#696f7c] sm:text-sm">
            Gerencie as preferências institucionais, notificações, autenticação e conformidade.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 animate-in fade-in duration-150">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Alterações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[#e8eaee] pb-px text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 transition ${
            activeSubTab === 'general'
              ? 'border-[#5a50e5] text-[#5a50e5]'
              : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
          }`}
        >
          <Building2 className="size-4" />
          <span>Geral & Workspace</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 transition ${
            activeSubTab === 'notifications'
              ? 'border-[#5a50e5] text-[#5a50e5]'
              : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
          }`}
        >
          <Bell className="size-4" />
          <span>Notificações & E-mails</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 transition ${
            activeSubTab === 'security'
              ? 'border-[#5a50e5] text-[#5a50e5]'
              : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
          }`}
        >
          <Shield className="size-4" />
          <span>Segurança & Auditoria</span>
        </button>
      </div>

      {/* SUB-TAB: GENERAL */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card: Perfil da Organização */}
          <div className="rounded-xl border border-[#e8eaee] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#1e232f]">Identidade do Workspace</h3>
            <p className="mt-1 text-xs text-[#71788a]">
              Informações públicas visíveis nos relatórios e cabeçalhos de procedimentos operacionais.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Nome da Empresa / Organização
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                  className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Slug / Subdomínio no DocFlow
                </label>
                <div className="mt-1.5 flex h-10 items-center rounded-lg border border-[#d0d4dc] px-3 text-xs bg-white focus-within:border-[#5a50e5] focus-within:ring-2 focus-within:ring-[#5a50e5]/10">
                  <span className="text-[#8c93a4]">app.docflow.io/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="flex-1 border-0 bg-transparent px-1 text-xs text-[#1e232f] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  E-mail de Contato para Governança
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Idioma Padrão dos POPs
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Español (Latinoamérica)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Fuso Horário Oficial dos Registros
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                >
                  <option value="America/Sao_Paulo (GMT-03:00)">
                    Brasília (GMT-03:00) — America/Sao_Paulo
                  </option>
                  <option value="America/Manaus (GMT-04:00)">
                    Manaus (GMT-04:00) — America/Manaus
                  </option>
                  <option value="UTC (GMT+00:00)">UTC — Universal Coordinated Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db] active:scale-[0.98]"
            >
              <Save className="size-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-xl border border-[#e8eaee] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#1e232f]">Preferências de Alertas & Notificações</h3>
            <p className="mt-1 text-xs text-[#71788a]">
              Escolha quais eventos corporativos disparam notificações por e-mail e na plataforma.
            </p>

            <div className="mt-5 divide-y divide-[#f0f2f5]">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-xs font-semibold text-[#1e232f]">
                    Solicitações de Aprovação de Documentos
                  </p>
                  <p className="text-[11px] text-[#71788a]">
                    Receba um alerta imediato quando um colaborador submeter um POP para sua homologação.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifApprovals}
                  onChange={(e) => setNotifApprovals(e.target.checked)}
                  className="size-4.5 rounded border-[#d0d4dc] text-[#5a50e5] focus:ring-[#5a50e5]"
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-xs font-semibold text-[#1e232f]">
                    Publicação de Novas Políticas
                  </p>
                  <p className="text-[11px] text-[#71788a]">
                    Notificar os colaboradores do setor quando uma nova versão oficial for publicada.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifNewDocs}
                  onChange={(e) => setNotifNewDocs(e.target.checked)}
                  className="size-4.5 rounded border-[#d0d4dc] text-[#5a50e5] focus:ring-[#5a50e5]"
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-xs font-semibold text-[#1e232f]">
                    Aviso de Vencimento de Ciclo de Vigência (ISO 9001)
                  </p>
                  <p className="text-[11px] text-[#71788a]">
                    Disparar alerta com 30 dias de antecedência para revisão obrigatória de procedimentos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifExpiring}
                  onChange={(e) => setNotifExpiring(e.target.checked)}
                  className="size-4.5 rounded border-[#d0d4dc] text-[#5a50e5] focus:ring-[#5a50e5]"
                />
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-xs font-semibold text-[#1e232f]">
                    Resumo Semanal de Atividades
                  </p>
                  <p className="text-[11px] text-[#71788a]">
                    Relatório consolidado nas segundas-feiras com métricas de acesso e documentos revisados.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifWeeklyDigest}
                  onChange={(e) => setNotifWeeklyDigest(e.target.checked)}
                  className="size-4.5 rounded border-[#d0d4dc] text-[#5a50e5] focus:ring-[#5a50e5]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db] active:scale-[0.98]"
            >
              <Save className="size-3.5" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB: SECURITY & AUDIT */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Card: Autenticação & Conformidade */}
          <div className="rounded-xl border border-[#e8eaee] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#1e232f]">Políticas de Acesso & Criptografia</h3>
            <p className="mt-1 text-xs text-[#71788a]">
              Controles de autenticação reforçada em conformidade com padrões SOC 2 e LGPD.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-[#e8eaee] bg-[#fcfcfd] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1e232f]">
                      Autenticação de Dois Fatores (MFA / 2FA)
                    </p>
                    <p className="text-[11px] text-[#71788a]">
                      Exigir verificação via aplicativo autenticador (TOTP) para administradores e gestores.
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  Obrigatório Ativo
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Tempo Limite de Sessão Inativa
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="4">4 horas de inatividade</option>
                    <option value="8">8 horas (Jornada de Trabalho)</option>
                    <option value="24">24 horas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Ciclo de Expiração de Senha
                  </label>
                  <select
                    value={passwordRotation}
                    onChange={(e) => setPasswordRotation(e.target.value)}
                    className="mt-1.5 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="60">A cada 60 dias</option>
                    <option value="90">A cada 90 dias (Recomendado)</option>
                    <option value="180">A cada 180 dias</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Sessões Ativas */}
          <div className="rounded-xl border border-[#e8eaee] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#1e232f]">Sessões Ativas no Dispositivo</h3>
            <p className="mt-1 text-xs text-[#71788a]">
              Aparelhos conectados no momento à sua conta corporativa.
            </p>

            <div className="mt-4 divide-y divide-[#f0f2f5]">
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <Laptop className="size-5 text-[#5a50e5]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1e232f]">
                      Windows 11 — Google Chrome (Sessão Atual)
                    </p>
                    <p className="text-[10px] text-[#71788a]">São Paulo, Brasil • IP 177.18.92.14 • Ativo agora</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <Smartphone className="size-5 text-[#798094]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1e232f]">
                      iPhone 15 Pro — DocFlow Mobile App
                    </p>
                    <p className="text-[10px] text-[#71788a]">São Paulo, Brasil • Há 3 horas</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Sessão encerrada com sucesso.')}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Encerrar
                </button>
              </div>
            </div>
          </div>

          {/* Card: Logs de Auditoria */}
          <div className="rounded-xl border border-[#e8eaee] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1e232f]">Trilha de Auditoria (Audit Log)</h3>
                <p className="mt-1 text-xs text-[#71788a]">
                  Registro imutável de aprovações, revisões e acessos a políticas corporativas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => alert('Exportando registro de auditoria em CSV...')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d4dc] bg-white px-3 py-1.5 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
              >
                <Download className="size-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
