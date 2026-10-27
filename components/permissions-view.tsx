'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  Users,
  UserPlus,
  Key,
  Check,
  X,
  Lock,
  ChevronDown,
  Building,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  Search,
  Trash2,
  Crown,
  Info,
} from 'lucide-react'
import { useAuth, User, UserRole, DEFAULT_ADMIN } from '@/lib/auth-context'

const PERMISSIONS_MATRIX = [
  {
    action: 'Criar novos POPs, Políticas e Manuais',
    category: 'Documentação',
    admin: true,
    manager: true,
    editor: true,
    viewer: false,
  },
  {
    action: 'Homologar e Aprovar Versões Oficiais (Publicação)',
    category: 'Governança',
    admin: true,
    manager: true,
    editor: false,
    viewer: false,
  },
  {
    action: 'Descontinuar ou Arquivar Procedimentos',
    category: 'Governança',
    admin: true,
    manager: true,
    editor: false,
    viewer: false,
  },
  {
    action: 'Acessar Trilha de Auditoria (Audit Log)',
    category: 'Segurança',
    admin: true,
    manager: false,
    editor: false,
    viewer: false,
  },
  {
    action: 'Criar e Cadastrar Novos Usuários Internamente',
    category: 'Administração',
    admin: true,
    manager: false,
    editor: false,
    viewer: false,
  },
  {
    action: 'Alterar Papéis e Níveis de Acesso',
    category: 'Administração',
    admin: true,
    manager: false,
    editor: false,
    viewer: false,
  },
  {
    action: 'Visualizar e Exportar Documentos Publicados (PDF)',
    category: 'Leitura',
    admin: true,
    manager: true,
    editor: true,
    viewer: true,
  },
]

export function PermissionsView() {
  const { user: currentUser, users, createUser, updateUserRole, deleteUser } = useAuth()

  const [memberSearch, setMemberSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'members' | 'matrix'>('members')
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Create User Form State
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserDept, setNewUserDept] = useState('TI & Segurança')
  const [newUserRole, setNewUserRole] = useState<UserRole>('Editor')
  const [newUserPassword, setNewUserPassword] = useState('123456')
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const isMasterAdmin = currentUser?.role === 'Administrador'

  const filteredMembers = users.filter((m) =>
    `${m.name} ${m.email} ${m.department} ${m.role}`
      .toLowerCase()
      .includes(memberSearch.toLowerCase())
  )

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!isMasterAdmin) {
      setFeedbackMsg({ type: 'error', text: 'Apenas o Administrador pode alterar perfis de acesso.' })
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    if (userId === DEFAULT_ADMIN.id) {
      setFeedbackMsg({ type: 'error', text: 'O perfil do Administrador Mestre não pode ser alterado.' })
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    updateUserRole(userId, newRole)
    setFeedbackMsg({ type: 'success', text: 'Perfil de acesso atualizado com sucesso.' })
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!isMasterAdmin) {
      setFeedbackMsg({ type: 'error', text: 'Apenas o Administrador pode remover usuários.' })
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    if (userId === DEFAULT_ADMIN.id) {
      setFeedbackMsg({ type: 'error', text: 'O Administrador Mestre não pode ser excluído do sistema.' })
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    if (confirm(`Tem certeza que deseja remover o acesso do usuário "${userName}"?`)) {
      deleteUser(userId)
      setFeedbackMsg({ type: 'success', text: `Usuário ${userName} removido com sucesso.` })
      setTimeout(() => setFeedbackMsg(null), 3000)
    }
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Preencha todos os campos obrigatórios.' })
      return
    }

    const result = createUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      department: newUserDept,
      role: newUserRole,
      password: newUserPassword.trim() || '123456',
    })

    if (result.success) {
      setIsInviteOpen(false)
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPassword('123456')
      setFeedbackMsg({
        type: 'success',
        text: `Usuário cadastrado com sucesso! Já pode realizar login no sistema.`,
      })
      setTimeout(() => setFeedbackMsg(null), 4000)
    } else {
      setFeedbackMsg({
        type: 'error',
        text: result.error || 'Erro ao cadastrar usuário.',
      })
      setTimeout(() => setFeedbackMsg(null), 4000)
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10">
      {/* Top Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1c24] sm:text-[28px]">
              Controle de Acessos & Permissões (RBAC)
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#edeefc] px-2.5 py-0.5 text-xs font-semibold text-[#5a50e5]">
              {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#696f7c] sm:text-sm">
            Gerencie papéis, regras de homologação de documentos e cadastre internamente novos usuários.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {feedbackMsg && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold animate-in fade-in duration-150 ${
                feedbackMsg.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <AlertCircle className="size-4 text-red-600" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {isMasterAdmin ? (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-4 text-xs font-semibold text-white shadow-[0_3px_10px_rgba(90,80,229,0.25)] transition hover:bg-[#4d43db] active:scale-[0.98]"
            >
              <UserPlus className="size-4" />
              <span>Cadastrar Novo Usuário</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#e1e4ea] bg-[#f8f9fa] px-3 py-2 text-xs text-[#71788a]">
              <Lock className="size-3.5 text-[#9ca3af]" />
              <span>Apenas Administradores podem cadastrar membros</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Cards Overview */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-[#e8eaee] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded border border-[#dcd7fe] bg-[#edeefc] px-2 py-0.5 text-[10px] font-bold text-[#5a50e5]">
              Administrador
            </span>
            <ShieldCheck className="size-4 text-[#5a50e5]" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1e232f]">Acesso Irrestrito</p>
          <p className="mt-1 text-[11px] text-[#71788a]">
            Configurações globais, cadastro de usuários, exclusão e governança plena.
          </p>
        </div>

        <div className="rounded-xl border border-[#e8eaee] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Gestor de Processos
            </span>
            <BadgeCheck className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1e232f]">Homologação e Publicação</p>
          <p className="mt-1 text-[11px] text-[#71788a]">
            Assina digitalmente versões de POPs, revisa e aprova procedimentos do setor.
          </p>
        </div>

        <div className="rounded-xl border border-[#e8eaee] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              Editor / Autor
            </span>
            <FileText className="size-4 text-blue-600" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1e232f]">Redação de POPs</p>
          <p className="mt-1 text-[11px] text-[#71788a]">
            Cria rascunhos de políticas e envia para homologação dos gestores.
          </p>
        </div>

        <div className="rounded-xl border border-[#e8eaee] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
              Leitor Geral
            </span>
            <Users className="size-4 text-gray-500" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1e232f]">Consulta & Treinamento</p>
          <p className="mt-1 text-[11px] text-[#71788a]">
            Acesso a todos os procedimentos vigentes e download de cópias em PDF.
          </p>
        </div>
      </div>

      {/* Tabs Switcher: Members vs Matrix */}
      <div className="mb-5 flex gap-2 border-b border-[#e8eaee] pb-px text-xs font-semibold">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 transition ${
            activeTab === 'members'
              ? 'border-[#5a50e5] text-[#5a50e5]'
              : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
          }`}
        >
          <Users className="size-4" />
          <span>Usuários Cadastrados ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 transition ${
            activeTab === 'matrix'
              ? 'border-[#5a50e5] text-[#5a50e5]'
              : 'border-transparent text-[#6e7687] hover:text-[#1e232f]'
          }`}
        >
          <Lock className="size-4" />
          <span>Matriz de Permissões por Perfil</span>
        </button>
      </div>

      {/* TAB: MEMBERS LIST */}
      {activeTab === 'members' && (
        <div className="overflow-hidden rounded-xl border border-[#e8eaee] bg-white shadow-xs">
          {/* Search Box in Table Header */}
          <div className="flex flex-col gap-3 border-b border-[#e8eaee] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Buscar por nome, e-mail ou setor..."
                className="h-9 w-full rounded-lg border border-[#e1e4ea] bg-[#f8f9fa] pl-9 pr-3 text-xs text-[#1e232f] placeholder:text-[#9ca3af] focus:border-[#5a50e5] focus:bg-white focus:outline-none"
              />
            </div>

            {users.length === 1 && (
              <div className="flex items-center gap-2 rounded-lg bg-[#edeefc]/60 px-3 py-1.5 text-xs text-[#5a50e5]">
                <Info className="size-4 shrink-0" />
                <span>
                  Apenas o <strong>Administrador Mestre</strong> está cadastrado no sistema.
                </span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e8eaee] bg-[#f9fafb] text-[11px] font-semibold uppercase tracking-wider text-[#798094]">
                <tr>
                  <th scope="col" className="py-3.5 pl-5 pr-3">
                    Usuário
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Departamento
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Perfil de Acesso
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Cadastrado Em
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-5 text-right">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredMembers.map((member) => {
                  const isDefaultAdmin = member.id === DEFAULT_ADMIN.id || member.email === DEFAULT_ADMIN.email

                  return (
                    <tr key={member.id} className="hover:bg-[#fafbfd] transition">
                      <td className="py-3.5 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs ${
                              member.avatarColor || 'bg-[#5a50e5]'
                            }`}
                          >
                            {member.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-[#1e232f]">{member.name}</p>
                              {isDefaultAdmin && (
                                <span className="inline-flex items-center gap-1 rounded bg-[#edeefc] px-1.5 py-0.2 text-[9px] font-bold text-[#5a50e5]">
                                  <Crown className="size-2.5 text-[#5a50e5]" />
                                  Master
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#71788a]">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-[#525866]">
                        <span className="rounded-md bg-[#f1f2f5] px-2 py-1 text-[11px] font-medium text-[#424754]">
                          {member.department}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5">
                        {isDefaultAdmin ? (
                          <span className="inline-flex items-center rounded-lg border border-[#dcd7fe] bg-[#edeefc] px-2.5 py-1 text-xs font-semibold text-[#5a50e5]">
                            Administrador (Mestre)
                          </span>
                        ) : (
                          <select
                            disabled={!isMasterAdmin}
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(member.id, e.target.value as UserRole)
                            }
                            className="rounded-lg border border-[#d0d4dc] bg-white px-2.5 py-1 text-xs font-semibold text-[#1e232f] shadow-2xs focus:border-[#5a50e5] focus:outline-none disabled:bg-[#f8f9fa] disabled:text-[#9ca3af]"
                          >
                            <option value="Administrador">Administrador</option>
                            <option value="Gestor de Processos">Gestor de Processos</option>
                            <option value="Editor">Editor</option>
                            <option value="Leitor">Leitor</option>
                          </select>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-600" />
                          Ativo
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-[#71788a]">
                        {member.createdAt || 'Sistema'}
                      </td>

                      <td className="whitespace-nowrap py-3.5 pl-3 pr-5 text-right">
                        {isDefaultAdmin ? (
                          <span className="text-[11px] text-[#9ca3af]">Principal</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(member.id, member.name)}
                            disabled={!isMasterAdmin}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-40"
                            title="Remover acesso do usuário"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Remover</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="overflow-hidden rounded-xl border border-[#e8eaee] bg-white shadow-xs">
          <div className="p-5 border-b border-[#e8eaee]">
            <h3 className="text-sm font-bold text-[#1e232f]">
              Matriz de Responsabilidades & Permissões
            </h3>
            <p className="mt-1 text-xs text-[#71788a]">
              Mapeamento formal de privilégios para cada papel do Sistema de Gestão DocFlow.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e8eaee] bg-[#f9fafb] text-[11px] font-semibold uppercase tracking-wider text-[#798094]">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    Funcionalidade / Operação
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Categoria
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Administrador
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Gestor de Processos
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Editor
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-6 text-center">
                    Leitor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {PERMISSIONS_MATRIX.map((item, index) => (
                  <tr key={index} className="hover:bg-[#fafbfd] transition">
                    <td className="py-3.5 pl-6 pr-3 font-semibold text-[#1e232f]">
                      {item.action}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-[#71788a]">
                      <span className="rounded bg-[#f1f2f5] px-2 py-0.5 font-medium text-[#525866]">
                        {item.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      {item.admin ? (
                        <Check className="mx-auto size-4 text-emerald-600" />
                      ) : (
                        <X className="mx-auto size-4 text-gray-300" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      {item.manager ? (
                        <Check className="mx-auto size-4 text-emerald-600" />
                      ) : (
                        <X className="mx-auto size-4 text-gray-300" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      {item.editor ? (
                        <Check className="mx-auto size-4 text-emerald-600" />
                      ) : (
                        <X className="mx-auto size-4 text-gray-300" />
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3.5 pl-3 pr-6 text-center">
                      {item.viewer ? (
                        <Check className="mx-auto size-4 text-emerald-600" />
                      ) : (
                        <X className="mx-auto size-4 text-gray-300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRAR NOVO USUÁRIO INTERNO */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#5a50e5]/10 text-[#5a50e5]">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1e232f]">Cadastrar Usuário Interno</h3>
                  <p className="text-xs text-[#71788a]">
                    Crie um novo acesso diretamente no servidor DocFlow.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="rounded-lg p-1 text-[#98a0b0] hover:bg-[#f1f2f5] hover:text-[#525866]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  E-mail Corporativo de Login *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="mariana.silva@empresa.com.br"
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Departamento
                  </label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="TI & Segurança">TI & Segurança</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operações">Operações</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Engenharia">Engenharia</option>
                    <option value="Qualidade & SGQ">Qualidade & SGQ</option>
                    <option value="Diretoria & Governança">Diretoria & Governança</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Perfil de Acesso
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Gestor de Processos">Gestor</option>
                    <option value="Leitor">Leitor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Senha Inicial de Acesso
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Defina a senha inicial (ex: 123456)"
                    className="block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setNewUserPassword(Math.random().toString(36).slice(-8))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#f1f2f5] px-2 py-1 text-[10px] font-semibold text-[#5a50e5] hover:bg-[#edeefc]"
                  >
                    Gerar Aleatória
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#71788a]">
                  O usuário usará este e-mail e senha para realizar o login na tela inicial.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#f0f2f5] pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="rounded-lg border border-[#d0d4dc] px-4 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#5a50e5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
