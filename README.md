# Budiva Analytics

Dashboard web para visualização e análise do mercado de capitais angolano, inspirado na BODIVA — Bolsa de Dívida e Valores de Angola.

A aplicação apresenta uma interface de nível profissional para acompanhar cotações, índices, volume de negociação, livro de ordens, mapa sectorial, curva de rendimentos e profundidade de mercado.

> **Estado do projecto:** protótipo/demo visual. Os dados apresentados actualmente são gerados localmente e simulados no frontend; não representam cotações reais nem devem ser utilizados para decisões financeiras.

## Funcionalidades

- Ticker horizontal com actualização visual das cotações.
- Índices de mercado e variações percentuais.
- Watchlist de acções e obrigações.
- Gráfico interactivo de preços e volume.
- Livro de ordens com ofertas de compra e venda.
- Tabela de resumo dos mercados.
- Mapa de desempenho por sector.
- Curva de rendimentos de obrigações do tesouro.
- Gráfico de profundidade de mercado.
- Layout responsivo para desktop e dispositivos móveis.
- Animações e transições com Framer Motion.
- Formatação de valores em português (`pt-PT`) e moeda AOA.

## Tecnologias

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://motion.dev/)
- [Lucide React](https://lucide.dev/)
- [Prisma](https://www.prisma.io/) com PostgreSQL
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/) e Playwright
- [Nitro](https://nitro.build/) para deploy do servidor

## Pré-requisitos

- Node.js 20 ou superior
- npm ou pnpm
- PostgreSQL, caso pretenda utilizar as funcionalidades de base de dados

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/mr-body/Budiva-analytics.git
cd Budiva-analytics
npm install
```

## Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Variáveis de ambiente

Para utilizar o Prisma e a ligação à base de dados, crie um ficheiro `.env.local` na raiz do projecto:

```env
DATABASE_URL="postgresql://utilizador:palavra-passe@localhost:5432/budiva_analytics"
```

O ficheiro `.env.local` não deve ser versionado. Nunca inclua credenciais reais no repositório.

## Base de dados

O projecto está preparado para utilizar Prisma com PostgreSQL. Os comandos disponíveis são:

```bash
# Gerar o Prisma Client
npm run db:generate

# Aplicar o schema actual à base de dados
npm run db:push

# Criar e aplicar uma migration durante o desenvolvimento
npm run db:migrate

# Abrir o Prisma Studio
npm run db:studio

# Executar o seed da base de dados
npm run db:seed
```

O schema actual contém uma entidade `Todo` de exemplo. A camada de dados pode ser expandida para armazenar utilizadores, instrumentos financeiros, cotações, ordens e histórico de mercado.

## Build de produção

Para gerar a build de produção:

```bash
npm run build
```

Para pré-visualizar a build localmente:

```bash
npm run preview
```

O projecto utiliza Nitro como servidor. Depois da build, pode iniciar o servidor com:

```bash
node dist/server/index.mjs
```

## Storybook

Para iniciar o Storybook:

```bash
npm run storybook
```

Para gerar a build estática do Storybook:

```bash
npm run build-storybook
```

## Estrutura principal

```text
.
├── prisma/              # Schema, migrations e seed da base de dados
├── public/               # Ficheiros públicos
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── data/             # Dados da aplicação
│   ├── hooks/            # React hooks personalizados
│   ├── integrations/     # Integrações externas
│   ├── lib/              # Utilitários e configurações
│   ├── routes/           # Rotas TanStack Router
│   ├── stories/          # Stories do Storybook
│   └── styles.css        # Estilos globais
├── package.json
├── prisma.config.ts
├── vite.config.ts
└── README.md
```

## Roadmap

- [ ] Substituir os dados simulados por uma API de mercado.
- [ ] Adicionar autenticação e perfis de utilizador.
- [ ] Persistir watchlists e preferências.
- [ ] Integrar dados históricos reais.
- [ ] Adicionar filtros e pesquisa funcional.
- [ ] Implementar exportação de relatórios para Excel/PDF.
- [ ] Criar testes automatizados para os principais componentes.
- [ ] Preparar deploy para produção.

## Contribuição

Contribuições são bem-vindas:

1. Faça um fork do projecto.
2. Crie uma branch para a sua alteração:

   ```bash
   git checkout -b feature/minha-alteracao
   ```

3. Faça as alterações e valide localmente.
4. Crie um commit descritivo:

   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. Envie a branch e abra um Pull Request.

## Licença

Este projecto ainda não possui uma licença definida. Adicione uma licença ao repositório antes de distribuir ou reutilizar o código em contexto comercial.

## Autor

Desenvolvido por [mr-body](https://github.com/mr-body).

Repositório: [github.com/mr-body/Budiva-analytics](https://github.com/mr-body/Budiva-analytics)
