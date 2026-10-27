'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Plus,
  FileText,
  CheckCircle2,
  Clock3,
  Archive,
  FileEdit,
  ExternalLink,
  ChevronDown,
  X,
  Eye,
  Download,
  Share2,
  Copy,
  BookOpen,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
  MoreVertical,
  Check,
  Building,
  KeyRound,
  FileSignature,
  Lock,
  Trash2,
} from 'lucide-react'
import {
  DocumentItem,
  INITIAL_DOCUMENTS,
  DEPARTMENTS,
  STATUS_LIST,
} from '@/lib/documents-data'
import { useAuth } from '@/lib/auth-context'
import { useDocuments } from '@/lib/documents-context'

type SortOption = 'recent' | 'oldest' | 'title-asc' | 'title-desc' | 'views'

export function DocumentsView() {
  const { user } = useAuth()
  const { documents, createDocument, approveDocument, deleteDocument } = useDocuments()
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('Todos')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null)
  const [isNewDocOpen, setIsNewDocOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Digital Signature State
  const [signModalDoc, setSignModalDoc] = useState<DocumentItem | null>(null)
  const [signPin, setSignPin] = useState('')
  const [signSuccess, setSignSuccess] = useState(false)

  // New Document Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDepartment, setNewDepartment] = useState('TI & Segurança')
  const [newType, setNewType] = useState<'POP' | 'Política' | 'Manual' | 'Instrução' | 'Guia'>('POP')
  const [newVersion, setNewVersion] = useState('v1.0')
  const [newDescription, setNewDescription] = useState('')
  const [newStatus, setNewStatus] = useState<DocumentItem['status']>('Em revisão')

  // RBAC Permission checks
  const canCreate = user?.role !== 'Leitor'
  const canApprove = user?.role === 'Administrador' || user?.role === 'Gestor de Processos'

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesQuery =
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.author.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDepartment =
          selectedDepartment === 'Todos' || doc.department === selectedDepartment

        const matchesStatus =
          selectedStatus === 'Todos' || doc.status === selectedStatus

        return matchesQuery && matchesDepartment && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return b.updatedTimestamp - a.updatedTimestamp
        if (sortBy === 'oldest') return a.updatedTimestamp - b.updatedTimestamp
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title)
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title)
        if (sortBy === 'views') return b.views - a.views
        return 0
      })
  }, [documents, searchQuery, selectedDepartment, selectedStatus, sortBy])

  // Summary counts
  const stats = useMemo(() => {
    const total = documents.length
    const published = documents.filter((d) => d.status === 'Publicado').length
    const inReview = documents.filter((d) => d.status === 'Em revisão').length
    const draft = documents.filter((d) => d.status === 'Rascunho').length
    const archived = documents.filter((d) => d.status === 'Arquivado').length
    return { total, published, inReview, draft, archived }
  }, [documents])

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const created = createDocument({
      title: newTitle.trim(),
      department: newDepartment,
      status: newStatus,
      version: newVersion.trim() || 'v1.0',
      updatedAt: 'Agora há pouco',
      author: user?.name || 'Administrador',
      authorInitials: user?.avatarInitials || 'AD',
      readTime: '5 min',
      type: newType,
      description: newDescription.trim() || 'Documento criado recentemente no workspace.',
      approver: newStatus === 'Publicado' ? `${user?.name || 'Administrador'} (${user?.role || 'Admin'})` : undefined,
    })

    setIsNewDocOpen(false)
    setNewTitle('')
    setNewDescription('')
    setSelectedDoc(created)
  }

  const handleConfirmSignature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signModalDoc || !user) return

    approveDocument(signModalDoc.id, `${user.name} (${user.role})`)

    if (selectedDoc?.id === signModalDoc.id) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'Publicado',
        approver: `${user.name} (${user.role})`,
        updatedAt: 'Hoje, agora',
      })
    }

    setSignSuccess(true)
    setTimeout(() => {
      setSignSuccess(false)
      setSignModalDoc(null)
      setSignPin('')
    }, 1500)
  }

  const handleCopyLink = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'Publicado':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Publicado
          </span>
        )
      case 'Em revisão':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200/60">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Em revisão
          </span>
        )
      case 'Rascunho':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
            <span className="size-1.5 rounded-full bg-slate-500" />
            Rascunho
          </span>
        )
      case 'Arquivado':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 border border-zinc-200">
            <span className="size-1.5 rounded-full bg-zinc-400" />
            Arquivado
          </span>
        )
    }
  }

  const getTypeBadge = (type: DocumentItem['type']) => {
    switch (type) {
      case 'POP':
        return 'bg-[#edeefc] text-[#5a50e5] border-[#dcd7fe]'
      case 'Política':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Manual':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Instrução':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-7 sm:px-8 lg:px-10">
      {/* RBAC Role Indicator Banner if Reader */}
      {user?.role === 'Leitor' && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-800">
          <div className="flex items-center gap-2.5">
            <Eye className="size-4 text-blue-600" />
            <span>
              Você está navegando como <strong>Leitor Geral ({user.name})</strong>. A criação e homologação de documentos é restrita a Editores e Gestores.
            </span>
          </div>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            Modo Somente Leitura
          </span>
        </div>
      )}

      {/* Top Header & New Document Button */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1c24] sm:text-[28px]">
              Documentos & Processos
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#edeefc] px-2.5 py-0.5 text-xs font-semibold text-[#5a50e5]">
              {filteredDocuments.length} itens
            </span>
          </div>
          <p className="mt-1 text-xs text-[#696f7c] sm:text-sm">
            Repositório central de Políticas, POPs, Manuais e Instruções de Trabalho da organização.
          </p>
        </div>

        {canCreate ? (
          <button
            onClick={() => setIsNewDocOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#5a50e5] px-4 text-xs font-semibold text-white shadow-[0_3px_10px_rgba(90,80,229,0.25)] transition hover:bg-[#4d43db] active:scale-[0.98]"
          >
            <Plus className="size-4" />
            <span>Novo Documento</span>
          </button>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
            Criação restrita para seu perfil
          </div>
        )}
      </div>

      {/* Summary Stat Pills */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setSelectedStatus('Todos')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedStatus === 'Todos'
              ? 'border-[#5a50e5] bg-[#f8f7ff] shadow-xs'
              : 'border-[#e8eaee] bg-white hover:border-[#d0d4dc]'
          }`}
        >
          <p className="text-[11px] font-medium text-[#7c8290]">Total no Workspace</p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1e232f]">{stats.total}</span>
            <FileText className="size-4 text-[#5a50e5]" />
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Publicado')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedStatus === 'Publicado'
              ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
              : 'border-[#e8eaee] bg-white hover:border-[#d0d4dc]'
          }`}
        >
          <p className="text-[11px] font-medium text-[#7c8290]">Publicados e Vigentes</p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">{stats.published}</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Em revisão')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedStatus === 'Em revisão'
              ? 'border-amber-500 bg-amber-50/60 shadow-xs'
              : 'border-[#e8eaee] bg-white hover:border-[#d0d4dc]'
          }`}
        >
          <p className="text-[11px] font-medium text-[#7c8290]">Em Revisão / Aprovação</p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700">{stats.inReview}</span>
            <Clock3 className="size-4 text-amber-600" />
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('Rascunho')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedStatus === 'Rascunho'
              ? 'border-slate-500 bg-slate-100/70 shadow-xs'
              : 'border-[#e8eaee] bg-white hover:border-[#d0d4dc]'
          }`}
        >
          <p className="text-[11px] font-medium text-[#7c8290]">Rascunhos em Edição</p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-700">{stats.draft}</span>
            <FileEdit className="size-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Department, Status, Sorting, and View Switcher */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#e8eaee] bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#98a0b0]">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por título, descrição, autor, versão ou tags..."
              className="block h-10 w-full rounded-lg border border-[#e1e4ea] bg-[#f8f9fa] py-2 pl-10 pr-9 text-xs text-[#1e232f] placeholder:text-[#9ca3af] transition focus:border-[#5a50e5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#98a0b0] hover:text-[#525866]"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Dropdown */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="h-10 appearance-none rounded-lg border border-[#e1e4ea] bg-white pl-3.5 pr-8 text-xs font-medium text-[#4b5162] shadow-2xs transition hover:border-[#c8ccd6] focus:border-[#5a50e5] focus:outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    Setor: {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#798094]" />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 appearance-none rounded-lg border border-[#e1e4ea] bg-white pl-3.5 pr-8 text-xs font-medium text-[#4b5162] shadow-2xs transition hover:border-[#c8ccd6] focus:border-[#5a50e5] focus:outline-none"
              >
                <option value="recent">Ordenar: Mais Recentes</option>
                <option value="oldest">Ordenar: Mais Antigos</option>
                <option value="title-asc">Ordenar: Título (A-Z)</option>
                <option value="title-desc">Ordenar: Título (Z-A)</option>
                <option value="views">Ordenar: Mais Visualizados</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#798094]" />
            </div>

            {/* View Mode Toggle (Table vs Cards) */}
            <div className="flex rounded-lg border border-[#e1e4ea] bg-[#f5f6f8] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Visualização em Tabela"
                className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-white font-semibold text-[#1e232f] shadow-2xs'
                    : 'text-[#6e7687] hover:text-[#1e232f]'
                }`}
              >
                <List className="size-4" />
                <span className="hidden sm:inline">Tabela</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Visualização em Cards"
                className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition ${
                  viewMode === 'cards'
                    ? 'bg-white font-semibold text-[#1e232f] shadow-2xs'
                    : 'text-[#6e7687] hover:text-[#1e232f]'
                }`}
              >
                <LayoutGrid className="size-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f0f2f5] pt-3 text-xs">
          <span className="mr-1 text-[11px] font-semibold text-[#8b91a0]">Status:</span>
          {STATUS_LIST.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                selectedStatus === status
                  ? 'bg-[#5a50e5] text-white shadow-2xs'
                  : 'bg-[#f1f2f5] text-[#525866] hover:bg-[#e6e8ec]'
              }`}
            >
              {status}
            </button>
          ))}

          {(selectedDepartment !== 'Todos' || selectedStatus !== 'Todos' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDepartment('Todos')
                setSelectedStatus('Todos')
                setSearchQuery('')
              }}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-[#5a50e5] hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* VIEW: TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-xl border border-[#e8eaee] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e8eaee] bg-[#f9fafb] text-[11px] font-semibold uppercase tracking-wider text-[#798094]">
                <tr>
                  <th scope="col" className="py-3.5 pl-5 pr-3">
                    Documento
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Setor
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Versão
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Autor
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Última Atualização
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-5 text-right">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="cursor-pointer transition hover:bg-[#f8f9fc]"
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#edeefc] text-[#5a50e5]">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#1e232f] hover:text-[#5a50e5] transition">
                              {doc.title}
                            </p>
                            <span
                              className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${getTypeBadge(
                                doc.type
                              )}`}
                            >
                              {doc.type}
                            </span>
                          </div>
                          <p className="mt-0.5 max-w-lg truncate text-[11px] text-[#71788a]">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-[#525866]">
                      <span className="rounded-md bg-[#f1f2f5] px-2 py-1 text-[11px] font-medium text-[#424754]">
                        {doc.department}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#1e232f]">
                        {doc.version}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      {getStatusBadge(doc.status)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-[#dcd9ff] text-[10px] font-bold text-[#5147d8]">
                          {doc.authorInitials}
                        </div>
                        <span className="text-[11px] font-medium text-[#3b4050]">{doc.author}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-[#798094]">
                      {doc.updatedAt}
                    </td>

                    <td className="whitespace-nowrap py-3.5 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {doc.status !== 'Publicado' && canApprove && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSignModalDoc(doc)
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-100 transition"
                            title="Aprovar e homologar documento oficialmente"
                          >
                            <FileSignature className="size-3" />
                            <span>Aprovar</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDoc(doc)
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-[#e1e4ea] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#424754] shadow-2xs hover:border-[#5a50e5] hover:text-[#5a50e5]"
                        >
                          <Eye className="size-3" />
                          <span>Ver</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto size-9 text-[#a8b0c0]" />
              <p className="mt-2 text-sm font-semibold text-[#1e232f]">
                Nenhum documento encontrado
              </p>
              <p className="mt-1 text-xs text-[#71788a]">
                Tente ajustar os termos de busca ou filtros aplicados.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: CARDS */}
      {viewMode === 'cards' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="group flex cursor-pointer flex-col justify-between rounded-xl border border-[#e8eaee] bg-white p-5 shadow-2xs transition-all hover:border-[#c8ccd6] hover:shadow-md"
            >
              <div>
                {/* Top Type and Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getTypeBadge(
                      doc.type
                    )}`}
                  >
                    {doc.type}
                  </span>
                  {getStatusBadge(doc.status)}
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-semibold text-[#1e232f] group-hover:text-[#5a50e5] transition line-clamp-2">
                  {doc.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs text-[#71788a] line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>

                {/* Department badge */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#525866]">
                  <Building className="size-3.5 text-[#8c93a4]" />
                  <span>{doc.department}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 border-t border-[#f0f2f5] pt-3.5">
                <div className="flex items-center justify-between text-xs text-[#798094]">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-[#dcd9ff] text-[10px] font-bold text-[#5147d8]">
                      {doc.authorInitials}
                    </div>
                    <span className="text-[11px] font-medium text-[#3b4050] truncate max-w-[100px]">
                      {doc.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-semibold text-[#1e232f]">{doc.version}</span>
                    <span>•</span>
                    <span>{doc.updatedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredDocuments.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <FileText className="mx-auto size-9 text-[#a8b0c0]" />
              <p className="mt-2 text-sm font-semibold text-[#1e232f]">
                Nenhum documento encontrado
              </p>
              <p className="mt-1 text-xs text-[#71788a]">
                Tente ajustar os termos de busca ou filtros aplicados.
              </p>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT PREVIEW DRAWER */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#e8eaee] px-6 py-4">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getTypeBadge(
                    selectedDoc.type
                  )}`}
                >
                  {selectedDoc.type}
                </span>
                {getStatusBadge(selectedDoc.status)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copiar link do documento"
                  className="rounded-lg p-1.5 text-[#6e7687] hover:bg-[#f1f2f5] hover:text-[#1e232f]"
                >
                  {copiedLink ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="rounded-lg p-1.5 text-[#6e7687] hover:bg-[#f1f2f5] hover:text-[#1e232f]"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <h2 className="text-xl font-bold tracking-tight text-[#1e232f]">
                {selectedDoc.title}
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-[#525866]">
                {selectedDoc.description}
              </p>

              {/* Metadata Cards */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[#e8eaee] bg-[#fbfbfc] p-3">
                  <p className="text-[10px] font-semibold text-[#798094]">Departamento</p>
                  <p className="mt-1 text-xs font-bold text-[#1e232f]">
                    {selectedDoc.department}
                  </p>
                </div>
                <div className="rounded-lg border border-[#e8eaee] bg-[#fbfbfc] p-3">
                  <p className="text-[10px] font-semibold text-[#798094]">Versão Atual</p>
                  <p className="mt-1 font-mono text-xs font-bold text-[#1e232f]">
                    {selectedDoc.version}
                  </p>
                </div>
                <div className="rounded-lg border border-[#e8eaee] bg-[#fbfbfc] p-3">
                  <p className="text-[10px] font-semibold text-[#798094]">Tempo de Leitura</p>
                  <p className="mt-1 text-xs font-bold text-[#1e232f]">
                    {selectedDoc.readTime}
                  </p>
                </div>
              </div>

              {/* Homologation & Governance Section */}
              <div className="mt-6 rounded-xl border border-[#e8eaee] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#798094]">
                    Governança & Assinaturas
                  </h4>

                  <div className="flex items-center gap-2">
                    {/* Se estiver como Rascunho, botão para enviar para revisão */}
                    {selectedDoc.status === 'Rascunho' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateDocument(selectedDoc.id, {
                            status: 'Em revisão',
                            updatedAt: 'Agora há pouco',
                          })
                          setSelectedDoc({
                            ...selectedDoc,
                            status: 'Em revisão',
                            updatedAt: 'Agora há pouco',
                          })
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition"
                      >
                        <Clock3 className="size-3.5 text-amber-600" />
                        <span>Enviar para Revisão</span>
                      </button>
                    )}

                    {/* Botão de homologação oficial se não estiver publicado */}
                    {selectedDoc.status !== 'Publicado' && canApprove && (
                      <button
                        type="button"
                        onClick={() => setSignModalDoc(selectedDoc)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition"
                      >
                        <FileSignature className="size-3.5" />
                        <span>Homologar Oficialmente</span>
                      </button>
                    )}

                    {/* Se já publicado, botão para abrir novo ciclo de revisão */}
                    {selectedDoc.status === 'Publicado' && canApprove && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Deseja abrir um novo ciclo de revisão para "${selectedDoc.title}"?`)) {
                            const [major, minor] = selectedDoc.version.replace('v', '').split('.').map(Number)
                            const nextVer = `v${major || 1}.${(minor || 0) + 1}`
                            updateDocument(selectedDoc.id, {
                              status: 'Em revisão',
                              version: nextVer,
                              updatedAt: 'Agora há pouco',
                              approver: undefined,
                            })
                            setSelectedDoc({
                              ...selectedDoc,
                              status: 'Em revisão',
                              version: nextVer,
                              updatedAt: 'Agora há pouco',
                              approver: undefined,
                            })
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d4dc] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5] transition"
                      >
                        <FileEdit className="size-3.5 text-[#5a50e5]" />
                        <span>Nova Revisão</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-[#edeefc] text-xs font-bold text-[#5a50e5]">
                        {selectedDoc.authorInitials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1e232f]">{selectedDoc.author}</p>
                        <p className="text-[10px] text-[#798094]">Autor responsável</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#798094]">{selectedDoc.updatedAt}</span>
                  </div>

                  {selectedDoc.approver ? (
                    <div className="flex items-center justify-between border-t border-[#f0f2f5] pt-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1e232f]">{selectedDoc.approver}</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Homologado e Aprovado</p>
                        </div>
                      </div>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Válido
                      </span>
                    </div>
                  ) : (
                    <div className="border-t border-[#f0f2f5] pt-3 text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded-lg flex items-center gap-2">
                      <Clock3 className="size-4 text-amber-600 shrink-0" />
                      <span>
                        Aguardando validação e assinatura digital por um Gestor de Processos ou Administrador.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Process Content Preview */}
              <div className="mt-6 rounded-xl border border-[#e8eaee] bg-[#fafbfc] p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#798094]">
                  Conteúdo Estruturado do Processo
                </h4>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#424754]">
                  <div>
                    <h5 className="font-semibold text-[#1e232f]">1. Objetivo e Escopo</h5>
                    <p className="mt-1 text-[11px] text-[#6e7687]">
                      Estabelecer os critérios e padrões operacionais aplicáveis a todos os colaboradores da organização para garantir conformidade e rastreabilidade contínua.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#1e232f]">2. Responsabilidades (RACI)</h5>
                    <p className="mt-1 text-[11px] text-[#6e7687]">
                      O time de {selectedDoc.department} é o Executor e Responsável direto pela manutenção deste procedimento sob supervisão da Governança DocFlow.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#1e232f]">3. Auditoria e Revisões</h5>
                    <p className="mt-1 text-[11px] text-[#6e7687]">
                      Ciclo de vigência de 12 meses. Próxima revisão agendada para o próximo semestre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#e8eaee] bg-[#f9fafb] px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg border border-[#d0d4dc] bg-white px-4 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                {user?.role === 'Administrador' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o documento "${selectedDoc.title}"?`)) {
                        deleteDocument(selectedDoc.id)
                        setSelectedDoc(null)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Excluir</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d4dc] bg-white px-3 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
                >
                  <Share2 className="size-3.5" />
                  <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Exportando documento '${selectedDoc.title}' em PDF oficial...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#5a50e5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  <Download className="size-3.5" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL SIGNATURE CONFIRMATION MODAL */}
      {signModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FileSignature className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1e232f]">Assinatura de Homologação</h3>
                  <p className="text-xs text-[#71788a]">Publicação e validação formal de POP.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSignModalDoc(null)}
                className="rounded-lg p-1 text-[#98a0b0] hover:bg-[#f1f2f5] hover:text-[#525866]"
              >
                <X className="size-5" />
              </button>
            </div>

            {signSuccess ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="mx-auto size-9 text-emerald-600" />
                <h4 className="mt-2 font-bold text-sm text-emerald-900">Documento Homologado!</h4>
                <p className="mt-1 text-[11px] text-emerald-700">
                  A assinatura digital foi registrada na trilha de auditoria e a nova versão já está pública.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmSignature} className="mt-4 space-y-4">
                <div className="rounded-xl border border-[#e8eaee] bg-[#f8f9fa] p-3 text-xs">
                  <p className="text-[10px] text-[#71788a] uppercase font-semibold">Documento Alvo</p>
                  <p className="font-bold text-[#1e232f] mt-0.5">{signModalDoc.title}</p>
                  <p className="text-[11px] text-[#525866] mt-0.5 font-mono">Versão: {signModalDoc.version}</p>
                </div>

                <div className="rounded-xl border border-[#e8eaee] bg-[#f8f9fa] p-3 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#71788a]">Assinante:</span>
                    <strong className="text-[#1e232f]">{user?.name}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#71788a]">Papel de Governança:</span>
                    <strong className="text-[#5a50e5]">{user?.role}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#71788a]">Hash SHA-256 de Integridade:</span>
                    <span className="font-mono text-[9px] text-[#71788a]">SHA256: 7f8a9b2c3d4e5f60</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Confirmação de Senha ou PIN de Autorização
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={signPin}
                    onChange={(e) => setSignPin(e.target.value)}
                    placeholder="Digite qualquer senha para confirmar..."
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#f0f2f5] pt-4">
                  <button
                    type="button"
                    onClick={() => setSignModalDoc(null)}
                    className="rounded-lg border border-[#d0d4dc] px-4 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <Check className="size-4" />
                    <span>Confirmar Homologação</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: NOVO DOCUMENTO */}
      {isNewDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#5a50e5]/10 text-[#5a50e5]">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1e232f]">Novo Documento</h3>
                  <p className="text-xs text-[#71788a]">
                    Cadastre uma nova política, POP ou instrução de trabalho.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDocOpen(false)}
                className="rounded-lg p-1 text-[#98a0b0] hover:bg-[#f1f2f5] hover:text-[#525866]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: POP - Controle de Acessos a Servidores"
                  className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] placeholder:text-[#9ca3af] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Setor Responsável
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'Todos').map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Tipo de Documento
                  </label>
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(
                        e.target.value as 'POP' | 'Política' | 'Manual' | 'Instrução' | 'Guia'
                      )
                    }
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="POP">POP (Procedimento Padrão)</option>
                    <option value="Política">Política Corporativa</option>
                    <option value="Manual">Manual Operacional</option>
                    <option value="Instrução">Instrução de Trabalho</option>
                    <option value="Guia">Guia Rápido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Versão Inicial
                  </label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] px-3.5 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3b4050]">
                    Status Inicial
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as DocumentItem['status'])}
                    className="mt-1 block h-10 w-full rounded-lg border border-[#d0d4dc] bg-white px-3 text-xs text-[#1e232f] focus:border-[#5a50e5] focus:outline-none"
                  >
                    <option value="Em revisão">Em revisão (Pronto para aprovação)</option>
                    <option value="Rascunho">Rascunho (Em elaboração)</option>
                    {canApprove && (
                      <option value="Publicado">Publicado (Aprovar e publicar agora)</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b4050]">
                  Descrição / Objetivo
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva brevemente a finalidade e escopo deste documento..."
                  className="mt-1 block w-full rounded-lg border border-[#d0d4dc] p-3 text-xs text-[#1e232f] placeholder:text-[#9ca3af] focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/10"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#f0f2f5] pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewDocOpen(false)}
                  className="rounded-lg border border-[#d0d4dc] px-4 py-2 text-xs font-semibold text-[#424754] hover:bg-[#f1f2f5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#5a50e5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4d43db]"
                >
                  Criar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
