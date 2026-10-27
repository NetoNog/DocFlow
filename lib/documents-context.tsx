'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { DocumentItem, INITIAL_DOCUMENTS } from './documents-data'

interface DocumentsContextType {
  documents: DocumentItem[]
  createDocument: (docData: Omit<DocumentItem, 'id' | 'updatedTimestamp' | 'views'>) => DocumentItem
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void
  deleteDocument: (id: string) => void
  approveDocument: (id: string, approverName: string) => void
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

const STORAGE_KEY = 'docflow_workspace_documents'

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load documents from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setDocuments(parsed)
        }
      }
    } catch (err) {
      console.error('Erro ao carregar documentos do storage:', err)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Listen to storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            setDocuments(parsed)
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const saveDocuments = (updated: DocumentItem[]) => {
    setDocuments(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
      console.error('Erro ao salvar documentos no storage:', err)
    }
  }

  const createDocument = (docData: Omit<DocumentItem, 'id' | 'updatedTimestamp' | 'views'>): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      updatedTimestamp: Date.now(),
      views: 1,
    }

    const updated = [newDoc, ...documents]
    saveDocuments(updated)
    return newDoc
  }

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    const updated = documents.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          ...updates,
          updatedTimestamp: Date.now(),
        }
      }
      return doc
    })
    saveDocuments(updated)
  }

  const deleteDocument = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id)
    saveDocuments(updated)
  }

  const approveDocument = (id: string, approverName: string) => {
    const updated = documents.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          status: 'Publicado' as const,
          approver: approverName,
          updatedAt: 'Hoje, agora',
          updatedTimestamp: Date.now(),
        }
      }
      return doc
    })
    saveDocuments(updated)
  }

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        createDocument,
        updateDocument,
        deleteDocument,
        approveDocument,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider')
  }
  return context
}
