export interface DocumentItem {
  id: string
  title: string
  department: string
  status: 'Publicado' | 'Em revisão' | 'Rascunho' | 'Arquivado'
  version: string
  updatedAt: string
  updatedTimestamp: number
  author: string
  authorInitials: string
  approver?: string
  readTime: string
  type: 'POP' | 'Política' | 'Manual' | 'Instrução' | 'Guia'
  description: string
  views: number
}

// All mocked documents removed as requested — starts clean for production/server use
export const INITIAL_DOCUMENTS: DocumentItem[] = []

export const DEPARTMENTS = [
  'Todos',
  'TI & Segurança',
  'Recursos Humanos',
  'Financeiro',
  'Operações',
  'Jurídico',
  'Engenharia',
  'Qualidade & SGQ',
]

export const STATUS_LIST = [
  'Todos',
  'Publicado',
  'Em revisão',
  'Rascunho',
  'Arquivado',
]
