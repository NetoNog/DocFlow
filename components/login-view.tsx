'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react'
import { useAuth, DEFAULT_ADMIN } from '@/lib/auth-context'

interface LoginViewProps {
  onSuccess?: () => void
}

type LoginStep = 'email' | 'password' | 'options' | 'forgot'

export function LoginView({ onSuccess }: LoginViewProps) {
  const { login, isLoading } = useAuth()

  const [step, setStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Forgot password state
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  // Step 1: Validate Email and proceed to Password
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMessage('Insira um endereço de e-mail corporativo válido (ex: nome@empresa.com).')
      return
    }

    setStep('password')
  }

  // Step 2: Validate Password and Authenticate
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!password) {
      setErrorMessage('Por favor, insira sua senha de acesso.')
      return
    }

    const result = await login(email, password, rememberMe)
    if (result.success) {
      if (onSuccess) onSuccess()
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.')
    }
  }

  // Fill Master Admin credentials helper
  const handleFillAdmin = () => {
    setEmail(DEFAULT_ADMIN.email)
    setPassword(DEFAULT_ADMIN.password || 'admin')
    setErrorMessage(null)
    setStep('password')
  }

  // Quick Direct Admin Login
  const handleAdminDirectLogin = async () => {
    setErrorMessage(null)
    const result = await login(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password || 'admin', true)
    if (result.success && onSuccess) {
      onSuccess()
    }
  }

  // Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido para receber as instruções.')
      return
    }
    setErrorMessage(null)
    setForgotLoading(true)

    setTimeout(() => {
      setForgotLoading(false)
      setForgotSent(true)
    }, 700)
  }

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-[#f4f5f8] text-[#1b1d24] antialiased">
      {/* Background Subtle Accent */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#e2e5eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Main Centered Card Container */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[440px]">
          {/* Main White Card (Microsoft Enterprise Style) */}
          <div className="rounded-xl border border-[#e1e4ea] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-10">
            {/* Top Brand Logo */}
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#5a50e5] text-white shadow-xs">
                <BookOpen className="size-[17px]" />
              </div>
              <span className="text-[19px] font-semibold tracking-[-0.03em] text-[#1e232f]">
                docflow
              </span>
            </div>

            {/* ERROR ALERT BANNER */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-in fade-in duration-150">
                <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit}>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1e232f]">
                  Entrar
                </h1>
                <p className="mt-1 text-xs text-[#6e7687]">
                  Acesse com sua conta corporativa do DocFlow
                </p>

                <div className="mt-5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="E-mail corporativo (ex: admin@docflow.io)"
                    required
                    autoFocus
                    className="block h-11 w-full rounded-md border border-[#c8ccd6] bg-transparent px-3.5 text-[13px] text-[#1e232f] placeholder:text-[#939aab] transition focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/15"
                  />
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-[#6e7687]">
                    Acesso inicial?{' '}
                    <button
                      type="button"
                      onClick={handleFillAdmin}
                      className="font-medium text-[#5a50e5] hover:underline"
                    >
                      Preencher Administrador Master
                    </button>
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null)
                        setStep('forgot')
                      }}
                      className="font-medium text-[#5a50e5] hover:underline"
                    >
                      Não consegue acessar sua conta?
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-9 min-w-[108px] items-center justify-center rounded-md bg-[#5a50e5] px-5 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#4d43db] active:bg-[#4338ca]"
                  >
                    Avançar
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PASSWORD */}
            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit}>
                {/* User email badge with back button */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setStep('email')
                    }}
                    className="group inline-flex items-center gap-2 text-xs text-[#525866] hover:text-[#1e232f]"
                  >
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="font-medium text-[#1e232f]">{email}</span>
                  </button>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-[#1e232f]">
                  Inserir senha
                </h1>

                <div className="relative mt-5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="Senha"
                    required
                    autoFocus
                    className="block h-11 w-full rounded-md border border-[#c8ccd6] bg-transparent pl-3.5 pr-10 text-[13px] text-[#1e232f] placeholder:text-[#939aab] transition focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#939aab] hover:text-[#525866]"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 rounded border-[#c8ccd6] text-[#5a50e5] focus:ring-[#5a50e5]"
                    />
                    <span className="text-[#525866]">Mantenha-me conectado</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setStep('forgot')
                    }}
                    className="font-medium text-[#5a50e5] hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setStep('email')
                    }}
                    className="text-xs font-medium text-[#6e7687] hover:text-[#1e232f]"
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-9 min-w-[108px] items-center justify-center gap-2 rounded-md bg-[#5a50e5] px-5 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#4d43db] active:bg-[#4338ca] disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <span>Entrar</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SIGN-IN OPTIONS */}
            {step === 'options' && (
              <div>
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setStep('email')
                    }}
                    className="group inline-flex items-center gap-2 text-xs text-[#525866] hover:text-[#1e232f]"
                  >
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Voltar para o login</span>
                  </button>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-[#1e232f]">
                  Opções de entrada
                </h1>
                <p className="mt-1 text-xs text-[#6e7687]">
                  Escolha como deseja se autenticar no workspace DocFlow
                </p>

                <div className="mt-6 space-y-2.5">
                  {/* Option 1: Master Admin Direct Login */}
                  <button
                    type="button"
                    onClick={handleAdminDirectLogin}
                    disabled={isLoading}
                    className="flex w-full items-center gap-3.5 rounded-lg border border-[#e1e4ea] p-3 text-left transition hover:border-[#c8ccd6] hover:bg-[#fafbfd]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#edeefc] text-[#5a50e5]">
                      <UserCheck className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#1e232f]">
                        Entrar como Administrador Master
                      </p>
                      <p className="truncate text-[11px] text-[#6e7687]">
                        admin@docflow.io (Acesso total para gestão de usuários)
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Standard Email */}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setStep('email')
                    }}
                    className="flex w-full items-center gap-3.5 rounded-lg border border-[#e1e4ea] p-3 text-left transition hover:border-[#c8ccd6] hover:bg-[#fafbfd]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#f1f2f5] text-[#525866]">
                      <KeyRound className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#1e232f]">
                        E-mail e senha corporativa
                      </p>
                      <p className="truncate text-[11px] text-[#6e7687]">
                        Para usuários cadastrados internamente pelo administrador
                      </p>
                    </div>
                  </button>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-[#c8ccd6] bg-white px-4 text-xs font-semibold text-[#3b4050] hover:bg-[#f6f7f9]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: FORGOT PASSWORD */}
            {step === 'forgot' && (
              <form onSubmit={handleForgotSubmit}>
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setForgotSent(false)
                      setStep('email')
                    }}
                    className="group inline-flex items-center gap-2 text-xs text-[#525866] hover:text-[#1e232f]"
                  >
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Voltar para o login</span>
                  </button>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-[#1e232f]">
                  Recuperar acesso
                </h1>
                <p className="mt-1 text-xs text-[#6e7687]">
                  Entre em contato com o Administrador do workspace ou solicite o link de redefinição.
                </p>

                {forgotSent ? (
                  <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Solicitação registrada!
                    </div>
                    <p className="mt-1.5 text-[11px] text-emerald-700 leading-relaxed">
                      Caso o e-mail esteja cadastrado, as instruções serão encaminhadas.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSent(false)
                        setStep('password')
                      }}
                      className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-md bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Prosseguir para o login
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-5">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail cadastrado"
                        required
                        autoFocus
                        className="block h-11 w-full rounded-md border border-[#c8ccd6] bg-transparent px-3.5 text-[13px] text-[#1e232f] placeholder:text-[#939aab] transition focus:border-[#5a50e5] focus:outline-none focus:ring-2 focus:ring-[#5a50e5]/15"
                      />
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-[#c8ccd6] bg-white px-4 text-xs font-semibold text-[#3b4050] hover:bg-[#f6f7f9]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="inline-flex h-9 min-w-[108px] items-center justify-center gap-2 rounded-md bg-[#5a50e5] px-5 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#4d43db] active:bg-[#4338ca] disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <span>Enviar link</span>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          {/* Microsoft-style External "Opções de entrada" Button below the card */}
          {step === 'email' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null)
                  setStep('options')
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#e1e4ea] bg-white py-2.5 px-4 text-xs font-medium text-[#4b5162] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:border-[#c8ccd6] hover:bg-[#fafbfd] hover:text-[#1e232f]"
              >
                <KeyRound className="size-3.5 text-[#6e7687]" />
                <span>Opções de entrada</span>
              </button>
            </div>
          )}

          {/* Quick Admin Helper Link below card */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-center">
            <span className="text-[11px] text-[#787f92]">Usuário inicial:</span>
            <button
              type="button"
              onClick={handleAdminDirectLogin}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5a50e5] hover:underline"
            >
              <span>admin@docflow.io (Administrador)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Microsoft Enterprise Style Minimalist Footer */}
      <footer className="relative z-10 border-t border-[#e5e8ee] bg-white/70 py-3.5 px-6 backdrop-blur-xs">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-[11px] text-[#71788a] sm:flex-row">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-[#10b981]" />
            <span>DocFlow Enterprise Identity Service</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#termos" className="hover:text-[#1e232f] hover:underline">
              Termos de uso
            </a>
            <a href="#privacidade" className="hover:text-[#1e232f] hover:underline">
              Privacidade e cookies
            </a>
            <a href="#ajuda" className="hover:text-[#1e232f] hover:underline">
              Ajuda
            </a>
            <span className="hidden sm:inline text-[#c8ccd6]">|</span>
            <span className="text-[#8c93a4]">© 2026 DocFlow</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
