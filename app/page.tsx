'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
  UserCheck,
  Lock,
  BadgeCheck,
  Crown,
  FilePlus,
  Building,
} from 'lucide-react'
import { useAuth, DEFAULT_ADMIN } from '@/lib/auth-context'
import { LoginView } from '@/components/login-view'
import { DocumentsView } from '@/components/documents-view'
import { SettingsView } from '@/components/settings-view'
import { PermissionsView } from '@/components/permissions-view'
import { ProfileModal } from '@/components/profile-modal'
import { LockScreen } from '@/components/lock-screen'
import { DEPARTMENTS } from '@/lib/documents-data'
import { useDocuments } from '@/lib/documents-context'

type TabType = 'overview' | 'documents' | 'departments' | 'people' | 'settings' | 'permissions'

export default function Page() {
  const { user, users, isAuthenticated, isLocked, lockSession, logout } = useAuth()
  const { documents } = useDocuments()

  const [activeTab, setActiveTab] = useState<TabType>('documents')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'documents', label: 'Documentos', icon: FileText, count: `${documents.length}` },
    { id: 'departments', label: 'Setores', icon: FolderKanban },
    { id: 'people', label: 'Pessoas & Acessos', icon: Users, count: `${users.length}` },
  ]

  const filteredOverviewDocs = useMemo(() => {
    return documents.slice(0, 4).filter((doc) => {
      const matchesQuery = `${doc.title} ${doc.department}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = activeFilter === 'Todos' || doc.status === activeFilter
      return matchesQuery && matchesFilter
    })
  }, [activeFilter, query, documents])

  // REQUIREMENT: The user always opens the login screen first
  if (!isAuthenticated) {
    return <LoginView />
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Administrador'
  const initials = user?.avatarInitials || 'AD'
  const role = user?.role || 'Administrador'
  const email = user?.email || 'admin@docflow.io'
  const avatarBg = user?.avatarColor || 'bg-[#5a50e5]'
  const isMasterAdmin = user?.email === DEFAULT_ADMIN.email

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#20232b]">
      {/* ENTERPRISE LOCK SCREEN OVERLAY IF LOCKED */}
      {isLocked && <LockScreen />}

      {/* USER PROFILE MODAL */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            aria-label="Fechar menu"
            className="fixed inset-0 z-20 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col border-r border-[#e9ebef] bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-[76px] items-center justify-between border-b border-[#f0f1f3] px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-[9px] bg-[#5a50e5] text-white shadow-xs">
                <BookOpen className="size-[17px]" />
              </div>
              <span className="text-[18px] font-semibold tracking-[-0.03em]">docflow</span>
            </div>
            <button className="text-[#9da2ad] lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col px-3 py-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a4a8b2]">
              Workspace
            </p>
            <nav className="flex flex-col gap-1">
              {navItems.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id as TabType)
                      setSidebarOpen(false)
                    }}
                    className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition ${
                      isActive
                        ? 'bg-[#f0efff] text-[#5147d8] font-semibold'
                        : 'text-[#696f7c] hover:bg-[#f6f7f9]'
                    }`}
                  >
                    <Icon className="size-[17px]" />
                    {label}
                    {count !== undefined && (
                      <span
                        className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? 'bg-[#5a50e5] text-white'
                            : 'bg-[#f1f2f4] text-[#8a8f9a]'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a4a8b2]">
              Governança & Sistema
            </p>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab('permissions')
                  setSidebarOpen(false)
                }}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition ${
                  activeTab === 'permissions'
                    ? 'bg-[#f0efff] text-[#5147d8] font-semibold'
                    : 'text-[#696f7c] hover:bg-[#f6f7f9]'
                }`}
              >
                <ShieldCheck className="size-[17px]" />
                Permissões & RBAC
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings')
                  setSidebarOpen(false)
                }}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition ${
                  activeTab === 'settings'
                    ? 'bg-[#f0efff] text-[#5147d8] font-semibold'
                    : 'text-[#696f7c] hover:bg-[#f6f7f9]'
                }`}
              >
                <Settings2 className="size-[17px]" />
                Configurações
              </button>
            </nav>

            <div className="mt-auto rounded-xl border border-[#e9e8ff] bg-[#f8f7ff] p-4">
              <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-[#e7e5ff] text-[#5a50e5]">
                <CircleHelp className="size-4" />
              </div>
              <p className="text-[12px] font-semibold text-[#37327f]">Servidor Corporativo</p>
              <p className="mt-1 text-[11px] leading-4 text-[#7975a4]">
                Gestão centralizada de POPs, Políticas e Procedimentos.
              </p>
              <button
                onClick={() => setActiveTab('permissions')}
                className="mt-3 text-[11px] font-semibold text-[#5a50e5]"
              >
                Gerenciar membros <ChevronRight className="ml-1 inline size-3" />
              </button>
            </div>
          </div>

          {/* User Profile & Action Box */}
          <div className="relative border-t border-[#f0f1f3] p-3">
            {userMenuOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-3 right-3 rounded-xl border border-[#e9ebef] bg-white p-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="border-b border-[#f0f1f3] px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-semibold text-[#1e232f]">{user?.name}</p>
                    {isMasterAdmin && (
                      <span className="inline-flex items-center gap-1 rounded bg-[#edeefc] px-1 py-0.2 text-[8px] font-bold text-[#5a50e5]">
                        <Crown className="size-2 text-[#5a50e5]" />
                        Mestre
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-[#8a8f9a]">{email}</p>
                  <span className="mt-1 inline-block rounded bg-[#edeefc] px-1.5 py-0.2 text-[9px] font-bold text-[#5a50e5]">
                    {role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      setIsProfileOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-medium text-[#696f7c] hover:bg-[#f7f8fa]"
                  >
                    <UserCheck className="size-3.5" />
                    Meu Perfil & Segurança
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      setActiveTab('permissions')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-medium text-[#5a50e5] bg-[#f8f7ff] hover:bg-[#edeefc]"
                  >
                    <ShieldCheck className="size-3.5" />
                    Gestão de Usuários (RBAC)
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      lockSession()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-medium text-[#696f7c] hover:bg-[#f7f8fa]"
                  >
                    <Lock className="size-3.5" />
                    Bloquear Tela
                  </button>

                  <div className="my-1 border-t border-[#f0f1f3]" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="size-3.5" />
                    Sair da conta
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[#f7f8fa]"
            >
              <div
                className={`flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarBg}`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold">{user?.name}</p>
                <p className="truncate text-[11px] text-[#969ba6]">{role}</p>
              </div>
              <ChevronDown
                className={`size-4 text-[#a3a7b1] transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </aside>

        {/* MAIN VIEW AREA */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex h-[76px] items-center justify-between border-b border-[#e9ebef] bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                className="text-[#6f7480] lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="size-5" />
              </button>

              <div>
                <p className="text-[12px] text-[#969ba6]">
                  {activeTab === 'documents'
                    ? 'Workspace / Documentos'
                    : activeTab === 'settings'
                    ? 'Workspace / Configurações'
                    : activeTab === 'permissions'
                    ? 'Workspace / Permissões'
                    : activeTab === 'departments'
                    ? 'Workspace / Setores'
                    : activeTab === 'people'
                    ? 'Workspace / Membros'
                    : 'Visão Geral'}
                </p>
                <h1 className="mt-0.5 text-[20px] font-semibold tracking-[-0.03em] text-[#1e232f]">
                  {activeTab === 'documents' ? (
                    'Repositório de Documentos'
                  ) : activeTab === 'settings' ? (
                    'Configurações da Conta & Workspace'
                  ) : activeTab === 'permissions' ? (
                    'Controle de Acessos & Permissões'
                  ) : activeTab === 'departments' ? (
                    'Setores da Organização'
                  ) : activeTab === 'people' ? (
                    'Membros & Acessos'
                  ) : (
                    <>Olá, {firstName} <span aria-hidden="true">—</span></>
                  )}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Active Role Indicator */}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#dcd7fe] bg-[#f8f7ff] px-3 py-1 text-xs font-semibold text-[#5a50e5]"
              >
                <span className="size-2 rounded-full bg-[#5a50e5]" />
                <span>Perfil: {role}</span>
              </div>

              <button
                type="button"
                onClick={lockSession}
                title="Bloquear sessão por inatividade"
                className="rounded-lg p-2 text-[#777d89] hover:bg-[#f7f8fa] transition"
              >
                <Lock className="size-[17px]" />
              </button>

              <button
                className="relative rounded-lg p-2 text-[#777d89] hover:bg-[#f7f8fa]"
                aria-label="Notificações"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#f05d72]" />
              </button>

              <div className="hidden h-6 w-px bg-[#eceef1] sm:block" />

              {/* Profile Avatar Trigger */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  title="Abrir Meu Perfil"
                  className={`flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-2xs hover:ring-2 hover:ring-[#5a50e5] transition ${avatarBg}`}
                >
                  {initials}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  title="Sair da plataforma"
                  className="flex items-center gap-1.5 rounded-lg border border-[#e8e9ed] bg-white px-2.5 py-1 text-xs font-semibold text-[#696f7c] shadow-2xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </header>

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && <DocumentsView />}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}

          {/* TAB: PERMISSIONS */}
          {activeTab === 'permissions' && <PermissionsView />}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10">
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[13px] font-medium text-[#737987]">Visão geral do workspace</p>
                  <h2 className="mt-1 text-[25px] font-semibold tracking-[-0.04em]">
                    Painel Operacional
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-4 text-[12px] font-semibold text-white shadow-[0_3px_8px_rgba(90,80,229,0.2)] transition hover:bg-[#4e45d4]"
                >
                  <FileText className="size-4" />
                  Ir para Documentos
                </button>
              </div>

              {/* Stats */}
              <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Documentos totais',
                    value: `${documents.length}`,
                    change: documents.length === 0 ? 'Repositório limpo' : 'Cadastrados no workspace',
                    icon: FileText,
                    tone: 'purple',
                  },
                  {
                    label: 'Publicados',
                    value: `${documents.filter((d) => d.status === 'Publicado').length}`,
                    change: 'Vigência oficial',
                    icon: CheckCircle2,
                    tone: 'green',
                  },
                  {
                    label: 'Em revisão',
                    value: `${documents.filter((d) => d.status === 'Em revisão').length}`,
                    change: 'Aguardando validação',
                    icon: Clock3,
                    tone: 'orange',
                  },
                  {
                    label: 'Usuários do Sistema',
                    value: `${users.length}`,
                    change: users.length === 1 ? '1 Administrador ativo' : `${users.length} usuários cadastrados`,
                    icon: Users,
                    tone: 'blue',
                  },
                ].map(({ label, value, change, icon: Icon, tone }) => (
                  <div key={label} className="rounded-xl border border-[#e9ebef] bg-white p-5">
                    <div className="flex items-start justify-between">
                      <p className="text-[12px] font-medium text-[#858a95]">{label}</p>
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${
                          tone === 'purple'
                            ? 'bg-[#f0efff] text-[#6359e5]'
                            : tone === 'green'
                            ? 'bg-[#e8f8f0] text-[#29a269]'
                            : tone === 'orange'
                            ? 'bg-[#fff4e5] text-[#d98b2b]'
                            : 'bg-[#eaf2ff] text-[#5184d5]'
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-[25px] font-semibold tracking-[-0.04em]">{value}</p>
                    <p className="mt-1 text-[11px] text-[#9a9faa]">{change}</p>
                  </div>
                ))}
              </div>

              {/* Recent Documents Table & Pending Actions */}
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
                <div className="min-w-0 rounded-xl border border-[#e9ebef] bg-white">
                  <div className="flex flex-col gap-4 border-b border-[#f0f1f3] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold">Documentos recentes</h3>
                      <p className="mt-1 text-[11px] text-[#999ea8]">
                        Procedimentos e políticas cadastrados no sistema.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="text-xs font-semibold text-[#5a50e5] hover:underline"
                    >
                      Abrir aba completa
                    </button>
                  </div>

                  {filteredOverviewDocs.length === 0 ? (
                    <div className="p-8 text-center">
                      <FilePlus className="mx-auto size-8 text-[#a4a8b2]" />
                      <p className="mt-2 text-sm font-semibold text-[#1e232f]">Nenhum documento cadastrado</p>
                      <p className="mt-1 text-xs text-[#71788a]">
                        O repositório está limpo. Comece criando seu primeiro procedimento ou POP.
                      </p>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#5a50e5] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4d43db]"
                      >
                        <Plus className="size-3.5" />
                        Criar Documento
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f2f3f5]">
                      {filteredOverviewDocs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setActiveTab('documents')}
                          className="flex cursor-pointer items-center gap-3 px-5 py-4 transition hover:bg-[#fafbfd]"
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edeefc] text-[10px] font-bold text-[#5a50e5]">
                            {doc.authorInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold">{doc.title}</p>
                            <p className="mt-1 truncate text-[11px] text-[#9a9faa]">
                              {doc.department} <span className="mx-1">·</span> {doc.version}
                            </p>
                          </div>
                          <div className="hidden w-24 sm:block">
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                              {doc.status}
                            </span>
                          </div>
                          <p className="hidden w-20 text-right text-[10px] text-[#a1a5ae] md:block">
                            {doc.updatedAt}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredOverviewDocs.length > 0 && (
                    <div className="border-t border-[#f0f1f3] p-4 text-center">
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="inline-flex items-center text-[11px] font-semibold text-[#5a50e5] hover:underline"
                      >
                        Ver todos os documentos <ChevronRight className="ml-1 inline size-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[#e9ebef] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold">Pendências & Revisões</h3>
                      <p className="mt-1 text-[11px] text-[#999ea8]">
                        Ações que precisam da sua atenção.
                      </p>
                    </div>
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#f1f2f5] text-[10px] font-bold text-[#525866]">
                      {documents.filter((d) => d.status === 'Em revisão').length}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-4">
                    {documents.filter((d) => d.status === 'Em revisão').length === 0 ? (
                      <div className="rounded-lg bg-[#f9fafb] p-3 text-center">
                        <CheckCircle2 className="mx-auto size-5 text-emerald-600" />
                        <p className="mt-1 text-xs font-semibold text-[#1e232f]">Tudo em dia!</p>
                        <p className="mt-0.5 text-[11px] text-[#71788a]">
                          Não há procedimentos aguardando homologação no momento.
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#fff4e5] text-[#d98b2b]">
                          <Clock3 className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold leading-4">
                            Documentos aguardando revisão
                          </p>
                          <p className="mt-1 text-[10px] text-[#9a9faa]">
                            {documents.filter((d) => d.status === 'Em revisão').length} documento(s) aguardando homologação.
                          </p>
                          <button
                            onClick={() => setActiveTab('documents')}
                            className="mt-2 text-[10px] font-semibold text-[#5a50e5]"
                          >
                            Revisar agora <ChevronRight className="ml-0.5 inline size-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1e232f]">Setores da Organização</h2>
                <p className="text-xs text-[#71788a]">Departamentos e estrutura do workspace.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DEPARTMENTS.filter((d) => d !== 'Todos').map((deptName) => {
                  const docCount = documents.filter((d) => d.department === deptName).length
                  const memberCount = users.filter((u) => u.department === deptName).length

                  return (
                    <div
                      key={deptName}
                      onClick={() => setActiveTab('documents')}
                      className="cursor-pointer rounded-xl border border-[#e8eaee] bg-white p-5 shadow-2xs hover:border-[#5a50e5] transition"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-[#1e232f]">{deptName}</h3>
                        <Building className="size-4 text-[#9ca3af]" />
                      </div>
                      <p className="mt-2 text-xs text-[#71788a]">
                        {docCount} {docCount === 1 ? 'documento ativo' : 'documentos ativos'}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#5a50e5]">
                        {memberCount} {memberCount === 1 ? 'membro vinculado' : 'membros vinculados'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB: PEOPLE */}
          {activeTab === 'people' && (
            <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#1e232f]">Usuários & Membros Cadastrados</h2>
                  <p className="text-xs text-[#71788a]">
                    {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'} no sistema.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  <ShieldCheck className="size-4" />
                  <span>Gerenciar na Matriz de Permissões</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3.5 rounded-xl border border-[#e8eaee] bg-white p-4 shadow-2xs"
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                        member.avatarColor || 'bg-[#5a50e5]'
                      }`}
                    >
                      {member.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-bold text-[#1e232f]">{member.name}</p>
                        {member.id === DEFAULT_ADMIN.id && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-[#edeefc] px-1 py-0.2 text-[8px] font-bold text-[#5a50e5]">
                            <Crown className="size-2 text-[#5a50e5]" />
                            Mestre
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-[#71788a]">{member.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded bg-[#f1f2f5] px-1.5 py-0.5 text-[9px] font-medium text-[#424754]">
                          {member.department}
                        </span>
                        <span className="text-[10px] font-semibold text-[#5a50e5]">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
