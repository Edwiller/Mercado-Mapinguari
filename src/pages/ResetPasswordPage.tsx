import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setError(''); setSuccess(''); setSubmitting(true)
    try {
      if (user) {
        if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.')
        if (password !== confirmPassword) throw new Error('As senhas não coincidem.')
        const { error: updateError } = await supabase.auth.updateUser({ password })
        if (updateError) throw updateError
        setSuccess('Senha atualizada com sucesso.')
        window.setTimeout(() => navigate('/conta', { replace: true }), 1000)
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/redefinir-senha` })
        if (resetError) throw resetError
        setSuccess('Se o e-mail estiver cadastrado, enviaremos um link de recuperação.')
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível concluir a solicitação.')
    } finally {
      setSubmitting(false)
    }
  }

  return <section className="min-h-[65vh] bg-forest-50 px-4 py-12"><div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-10"><p className="text-xs font-black tracking-widest text-forest-700 uppercase">Segurança da conta</p><h1 className="mt-2 text-3xl font-black text-forest-950">{user ? 'Crie uma nova senha' : 'Recuperar senha'}</h1><p className="mt-3 text-sm leading-6 text-stone-600">{user ? 'Escolha uma senha segura com pelo menos 8 caracteres.' : 'Informe seu e-mail e enviaremos as instruções de recuperação.'}</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</p>}{success && <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800" role="status">{success}</p>}<form className="mt-6 space-y-4" onSubmit={submit}>{user ? <><label className="block text-sm font-bold text-stone-700">Nova senha<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-forest-700" minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><label className="block text-sm font-bold text-stone-700">Confirmar nova senha<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-forest-700" minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label></> : <label className="block text-sm font-bold text-stone-700">E-mail<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-forest-700" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>}<button className="w-full rounded-xl bg-sun-400 px-5 py-3.5 font-extrabold text-forest-950 disabled:opacity-60" disabled={submitting} type="submit">{submitting ? 'Aguarde…' : user ? 'Atualizar senha' : 'Enviar link de recuperação'}</button></form><Link className="mt-6 block text-center text-sm font-bold text-forest-700 hover:underline" to={user ? '/conta' : '/entrar'}>Voltar</Link></div></section>
}
