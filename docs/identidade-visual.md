# Identidade Visual e Interface

## Direção visual

O Mercado Mapinguari combina padrões familiares de grandes marketplaces com uma identidade própria inspirada na Amazônia:

- verde-floresta para marca, navegação e confiança;
- amarelo-solar para ofertas e chamadas de ação;
- tons claros e terrosos para fundos e campanhas regionais;
- tipografia de sistema para carregamento rápido e boa legibilidade;
- cards densos, busca em destaque e navegação por departamentos.

A interface se inspira em padrões funcionais comuns do comércio eletrônico — busca central, categorias, avaliações, promoções e benefícios — sem copiar marca, textos ou layout proprietário de outra empresa.

## Componentes do Módulo 02

- cabeçalho responsivo em camadas;
- mega menu responsivo com expansão suave e acesso por teclado;
- busca demonstrativa;
- navegação horizontal de departamentos;
- banner promocional;
- categorias ilustradas;
- cards reutilizáveis de produtos;
- transição curta entre páginas e entrada progressiva dos produtos;
- seções de ofertas e produtos regionais;
- bloco do clube de benefícios;
- consulta demonstrativa de CEP;
- rodapé institucional;
- esqueletos de carregamento e mensagem de erro reutilizáveis.

## Dados demonstrativos

Produtos, avaliações, descontos, disponibilidade, frete, cupons e preços são fictícios. Eles estão isolados em `src/data/mockProducts.ts` para futura substituição por dados do Supabase.

## Imagens e créditos

As imagens são carregadas remotamente apenas durante a prototipação:

- fotografias de produtos e supermercado: [Unsplash](https://unsplash.com/);
- imagem principal do corredor: fotografia do Unsplash distribuída pela [Her Campus](https://www.hercampus.com/school/msu/my-go-to-grocery-list-as-a-broke-college-student/).

Antes da publicação, cada fotografia deverá ser validada individualmente, otimizada e armazenada de forma controlada, preferencialmente no Supabase Storage.

## Acessibilidade inicial

- landmarks semânticos (`header`, `nav`, `main`, `section`, `footer`);
- textos alternativos nas imagens;
- rótulos acessíveis em campos e botões com ícone;
- foco visível e contraste elevado;
- navegação adaptada a telas pequenas;
- mensagens explícitas para carregamento e falha.
- respeito à preferência `prefers-reduced-motion` do dispositivo.

## Evolução do menu e catálogo

A barra extensa de departamentos foi substituída por um botão único **Menu**. O painel expandido mostra somente ícones e nomes das categorias, evitando agrupamentos redundantes. No desktop ele funciona como mega menu em uma linha; no tablet e celular reorganiza os destinos em cinco ou três colunas.

O catálogo não depende mais de uma barra lateral fixa. Filtros em formato de chips mantêm a largura disponível para os produtos e podem ser percorridos horizontalmente em telas pequenas. Cada categoria possui pelo menos quatro produtos demonstrativos, evitando telas visualmente vazias.
