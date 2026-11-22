export type StoreCategory = {
  name: string
  slug: string
  icon: string
  description: string
}

export const storeCategories: StoreCategory[] = [
  { name: 'Hortifruti', slug: 'hortifruti', icon: '🥬', description: 'Frutas, verduras e legumes' },
  { name: 'Mercearia', slug: 'mercearia', icon: '🛒', description: 'Grãos, massas e itens básicos' },
  { name: 'Bebidas', slug: 'bebidas', icon: '🧃', description: 'Águas, sucos e refrigerantes' },
  { name: 'Produtos regionais', slug: 'produtos-regionais', icon: '🌿', description: 'Sabores da Amazônia' },
  { name: 'Padaria', slug: 'padaria', icon: '🥖', description: 'Pães e bolos frescos' },
  { name: 'Açougue', slug: 'acougue', icon: '🥩', description: 'Carnes e aves selecionadas' },
  { name: 'Laticínios', slug: 'laticinios', icon: '🥛', description: 'Leites, queijos e iogurtes' },
  { name: 'Limpeza', slug: 'limpeza', icon: '🧹', description: 'Cuidados para sua casa' },
  { name: 'Higiene', slug: 'higiene', icon: '🧴', description: 'Cuidados pessoais' },
]

export function categoryToSlug(categoryName: string) {
  return storeCategories.find((category) => category.name === categoryName)?.slug ?? ''
}
