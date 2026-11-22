type FeedbackStateProps = { type: 'loading' | 'error'; onRetry?: () => void }

export function FeedbackState({ type, onRetry }: FeedbackStateProps) {
  if (type === 'loading') {
    return <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Carregando produtos">{Array.from({ length: 4 }).map((_, index) => <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white" key={index}><div className="aspect-square bg-stone-200" /><div className="space-y-3 p-4"><div className="h-3 w-1/3 rounded bg-stone-200" /><div className="h-4 rounded bg-stone-200" /><div className="h-8 w-1/2 rounded bg-stone-200" /></div></div>)}</div>
  }

  return <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><strong className="block text-red-900">Não foi possível carregar os produtos.</strong><p className="mt-2 text-sm text-red-700">Verifique sua conexão e tente novamente.</p>{onRetry && <button className="mt-5 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white" onClick={onRetry} type="button">Tentar novamente</button>}</div>
}
