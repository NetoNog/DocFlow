'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginView } from '@/components/login-view'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  return <LoginView onSuccess={() => router.push('/')} />
}
