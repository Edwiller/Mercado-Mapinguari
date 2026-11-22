# Relatório Final — Mercado Mapinguari

> Documento incremental. Os campos serão preenchidos somente com dados reais e evidências obtidas ao longo dos módulos.

## Parte 1 — Definição do negócio digital

- **Nome:** Mercado Mapinguari — Seu mercado, nossa terra.
- **URL publicada:** a definir no módulo de publicação.
- **Segmento:** supermercado virtual demonstrativo.
- **Público-alvo:** consumidores que buscam praticidade, com foco na região Norte.
- **Proposta de valor:** experiência digital acessível, com destaque para produtos regionais.

## Parte 2 — Google Analytics

A preencher após configuração e coleta real de dados. Nenhuma métrica será inventada.

## Parte 3 — Conceitos da ementa

A preencher progressivamente nos módulos de marketing, relacionamento, logística e conformidade.

## Parte 4 — Requisitos técnicos

### Evidências do Módulo 01

- Fundação React, TypeScript e Vite criada.
- Tailwind CSS e React Router configurados.
- Homepage provisória responsiva e rota 404 adicionadas.
- Scripts de desenvolvimento, build, lint e preview definidos.

### Evidências do Módulo 02

- Identidade visual própria em verde-floresta, amarelo-solar e tons terrosos.
- Cabeçalho, busca, departamentos, hero, categorias, produtos, benefícios e rodapé responsivos.
- Cards reutilizáveis com dados demonstrativos tipados.
- Seção dedicada a produtos regionais amazônicos.
- Estados reutilizáveis de carregamento e erro.
- Avisos explícitos de preços, frete e operações simuladas.

### Banco, autenticação e catálogo

- Migration PostgreSQL versionada com todas as entidades previstas e índices.
- RLS e grants mínimos para visitantes, clientes e administradores.
- Trigger de criação automática de perfil após cadastro no Supabase Auth.
- Cadastro, login, logout, persistência de sessão e rota protegida.
- Catálogo com busca, ordenação, menu lateral e filtros por categorias.
- Layout adaptativo com catálogo em largura total e filtros horizontais em tablet/celular.
- Mega menu responsivo e animado, organizado somente por ícones e nomes das categorias.
- Pelo menos quatro produtos demonstrativos em cada categoria do catálogo.
- Transições de página e de produtos com alternativa para movimento reduzido.

A migration ainda depende de execução em uma instância Supabase real para produzir evidências de integração.

As evidências de execução e os demais requisitos serão registrados conforme forem efetivamente validados.
