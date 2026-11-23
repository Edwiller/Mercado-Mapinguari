import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'
import { trackEvent } from '../lib/analytics'

type AuthMode = 'login' | 'signup'

function getFriendlyError(error: unknown) {
  if (!(error instanceof Error)) return 'Não foi possível concluir. Tente novamente.'
  const message = error.message.toLowerCase()
  if (message.includes('invalid login')) return 'E-mail ou senha inválidos.'
  if (message.includes('already registered')) return 'Este e-mail já possui cadastro.'
  if (message.includes('password')) return 'A senha não atende aos requisitos de segurança.'
  return error.message
}

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, configured, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as { from?: string } | null)?.from ?? '/conta'

  if (user) return <Navigate to={destination} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup' && fullName.trim().length < 2) return setError('Informe seu nome completo.')
    if (!email.includes('@')) return setError('Informe um e-mail válido.')
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.')

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn({ email, password })
        trackEvent('login', { method: 'email' })
        navigate(destination, { replace: true })
      } else {
        const result = await signUp({ fullName, email, password })
        trackEvent('sign_up', { method: 'email' })
        if (result.needsEmailConfirmation) {
          setSuccess('Cadastro criado. Verifique seu e-mail para confirmar a conta antes de entrar.')
          setMode('login')
          setPassword('')
        } else {
          navigate('/conta', { replace: true })
        }
      }
    } catch (caughtError) {
      setError(getFriendlyError(caughtError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[70vh] bg-forest-50 px-4 py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200 lg:grid-cols-[.9fr_1.1fr]">
        <div className="hidden bg-forest-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Brand />
          <div><p className="text-sm font-bold tracking-widest text-sun-300 uppercase">Sua conta Mapinguari</p><h1 className="mt-4 text-4xl font-black">Mais praticidade em cada compra.</h1><ul className="mt-7 space-y-3 text-sm text-green-100"><li>✓ Histórico e acompanhamento de pedidos</li><li>✓ Endereços salvos com segurança</li><li>✓ Ofertas e benefícios personalizados</li></ul></div>
          <p className="text-xs text-green-200">Projeto demonstrativo. Não use senhas reutilizadas de outros serviços.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <p className="text-sm font-black tracking-widest text-forest-700 uppercase">{mode === 'login' ? 'Boas-vindas' : 'Crie sua conta'}</p>
          <h1 className="mt-2 text-3xl font-black text-forest-950">{mode === 'login' ? 'Entrar no Mercado Mapinguari' : 'Cadastro de cliente'}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{mode === 'login' ? 'Acesse seus dados e pedidos.' : 'Seus dados serão protegidos pelo Supabase Auth e pelas políticas do banco.'}</p>

          {!configured && <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><strong>Integração ainda não conectada.</strong><p className="mt-1">Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no arquivo `.env.local` para ativar cadastro e login.</p></div>}
          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</div>}
          {success && <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="status">{success}</div>}

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && <label className="block text-sm font-bold text-stone-700">Nome completo<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none transition focus:border-forest-700 focus:ring-3 focus:ring-green-100" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>}
            <label className="block text-sm font-bold text-stone-700">E-mail<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none transition focus:border-forest-700 focus:ring-3 focus:ring-green-100" autoComplete="email" inputMode="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label className="block text-sm font-bold text-stone-700">Senha<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none transition focus:border-forest-700 focus:ring-3 focus:ring-green-100" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /><span className="mt-1.5 block text-xs font-normal text-stone-500">Mínimo de 8 caracteres.</span></label>
            {mode === 'login' && <div className="-mt-2 text-right"><Link className="text-xs font-bold text-forest-700 hover:underline" to="/redefinir-senha">Esqueci minha senha</Link></div>}
            <button className="w-full rounded-xl bg-sun-400 px-5 py-3.5 font-extrabold text-forest-950 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !configured} type="submit">{submitting ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar minha conta'}</button>
          </form>

          <p className="mt-7 text-center text-sm text-stone-600">{mode === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?'} <button className="font-bold text-forest-700 hover:underline" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }} type="button">{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p>
        </div>
      </div>
    </section>
  )
}
