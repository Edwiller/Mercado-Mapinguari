import { useState, type FormEvent } from 'react'
import type { AddressInput } from '../services/account'

const initialAddress: AddressInput = {
  label: 'Casa', recipient_name: '', postal_code: '', street: '', number: '', complement: '',
  neighborhood: '', city: 'Rio Branco', state: 'AC', reference: '',
}

export function AddressForm({ onSave, onCancel, saving = false }: { onSave: (address: AddressInput) => Promise<void>; onCancel?: () => void; saving?: boolean }) {
  const [address, setAddress] = useState(initialAddress)
  const [error, setError] = useState('')
  const update = (field: keyof AddressInput, value: string) => setAddress((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (address.postal_code.replace(/\D/g, '').length !== 8) return setError('Informe um CEP com 8 números.')
    if (!address.recipient_name.trim() || !address.street.trim() || !address.number.trim() || !address.neighborhood.trim()) return setError('Preencha os campos obrigatórios.')
    try {
      await onSave({ ...address, postal_code: address.postal_code.replace(/\D/g, '') })
      setAddress(initialAddress)
    } catch {
      setError('Não foi possível salvar o endereço.')
    }
  }

  const inputClass = 'mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 font-normal outline-none focus:border-forest-700 focus:ring-3 focus:ring-green-100'

  return <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800 sm:col-span-2" role="alert">{error}</p>}
    <label className="text-sm font-bold text-stone-700">Identificação<input className={inputClass} value={address.label} onChange={(event) => update('label', event.target.value)} placeholder="Casa, trabalho…" required /></label>
    <label className="text-sm font-bold text-stone-700">Quem recebe<input className={inputClass} autoComplete="name" value={address.recipient_name} onChange={(event) => update('recipient_name', event.target.value)} required /></label>
    <label className="text-sm font-bold text-stone-700">CEP<input className={inputClass} inputMode="numeric" autoComplete="postal-code" maxLength={9} value={address.postal_code} onChange={(event) => update('postal_code', event.target.value)} placeholder="69900-000" required /></label>
    <label className="text-sm font-bold text-stone-700">Bairro<input className={inputClass} value={address.neighborhood} onChange={(event) => update('neighborhood', event.target.value)} required /></label>
    <label className="text-sm font-bold text-stone-700 sm:col-span-2">Rua<input className={inputClass} autoComplete="street-address" value={address.street} onChange={(event) => update('street', event.target.value)} required /></label>
    <label className="text-sm font-bold text-stone-700">Número<input className={inputClass} value={address.number} onChange={(event) => update('number', event.target.value)} required /></label>
    <label className="text-sm font-bold text-stone-700">Complemento<input className={inputClass} value={address.complement ?? ''} onChange={(event) => update('complement', event.target.value)} /></label>
    <label className="text-sm font-bold text-stone-700">Cidade<input className={inputClass} value={address.city} onChange={(event) => update('city', event.target.value)} required /></label>
    <label className="text-sm font-bold text-stone-700">Estado<input className={inputClass} maxLength={2} value={address.state} onChange={(event) => update('state', event.target.value.toUpperCase())} required /></label>
    <label className="text-sm font-bold text-stone-700 sm:col-span-2">Referência<input className={inputClass} value={address.reference ?? ''} onChange={(event) => update('reference', event.target.value)} placeholder="Próximo a…" /></label>
    <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="rounded-xl bg-forest-800 px-5 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? 'Salvando…' : 'Salvar endereço'}</button>{onCancel && <button className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-stone-700" onClick={onCancel} type="button">Cancelar</button>}</div>
  </form>
}
