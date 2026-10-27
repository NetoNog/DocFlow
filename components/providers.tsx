'use client'

import React from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { DocumentsProvider } from '@/lib/documents-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DocumentsProvider>
        {children}
      </DocumentsProvider>
    </AuthProvider>
  )
}
