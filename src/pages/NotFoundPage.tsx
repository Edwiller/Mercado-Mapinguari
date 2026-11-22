import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div>
        <p className="text-sm font-black tracking-widest text-forest-700 uppercase">Erro 404</p>
        <h1 className="mt-4 text-4xl font-black text-forest-950">Esta página ainda não chegou ao mercado.</h1>
        <p className="mt-4 text-stone-600">Confira o endereço ou volte para a página inicial.</p>
        <Link className="mt-8 inline-flex rounded-xl bg-forest-800 px-5 py-3 font-bold text-white hover:bg-forest-700" to="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}
