# autoconf-vehicles-web

Front-end React (SPA) de um desafio técnico SaaS multiusuário para gestão de veículos.
Consome a API em [`autoconf-vehicles-api`](https://github.com/LucasAAlv/autoconf-vehicles-api).

## Sumário

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como rodar](#como-rodar)
- [Dados de teste (login)](#dados-de-teste-login)
- [Decisões de bibliotecas](#decisões-de-bibliotecas)
- [Stack](#stack)

## Requisitos

- Node.js 20+ e npm
- A API (`autoconf-vehicles-api`) rodando localmente — este front-end não funciona sozinho

## Instalação

```bash
npm install
cp .env.example .env
```

## Configuração

`.env` só precisa de uma variável:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Para a sessão funcionar, a API também precisa reconhecer esta origem:

- `FRONTEND_URL=http://localhost:5173` no `.env` da API (usado em `config/cors.php`)
- `localhost:5173` incluído em `SANCTUM_STATEFUL_DOMAINS` no `.env` da API (já vem assim
  por padrão no `.env.example` do repositório da API)

Sem isso, o handshake de CSRF do Sanctum não reconhece a SPA como "front-end" e a
sessão nunca se estabelece — a chamada de login retorna sem erro, mas nenhuma rota
autenticada funciona depois.

## Como rodar

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173` (a porta é fixa — é a que a API
espera em `SANCTUM_STATEFUL_DOMAINS`).

Scripts úteis: `npm run build` (type-check + build de produção), `npm run lint`
(oxlint) e `npm run format` (Prettier).

## Dados de teste (login)

Os mesmos usuários seedados pela API:

| Usuário    | E-mail              | Senha      | Papel                                             |
| ---------- | ------------------- | ---------- | ------------------------------------------------- |
| Admin User | `admin@example.com` | `password` | admin — edita/exclui veículos de qualquer usuário |
| Test User  | `test@example.com`  | `password` | usuário comum — dono dos veículos de exemplo      |

Também é possível criar uma conta nova pela tela de cadastro (`/register`).

## Decisões de bibliotecas

- **MUI** — tabela, diálogo, snackbar e campos de formulário vêm prontos, e são
  exatamente os quatro componentes que este desafio precisa (listagem, confirmação de
  exclusão, feedback de sucesso/erro, formulário de veículo). Tema customizado em
  `src/shared/theme/theme.ts` em vez do visual padrão.
- **TanStack Query** — cache, paginação (`keepPreviousData`) e invalidação por chave
  resolvem a listagem de veículos sem reducers escritos à mão; preferido a
  Redux/Zustand para este escopo, que é majoritariamente estado de servidor.
- **React Hook Form + Zod** — o schema Zod do formulário de veículo (`schemas.ts`)
  espelha as mesmas regras dos Form Requests da API (regex de placa, tamanho do
  chassi, mínimos de `valor_venda`/`km`, enums de `cambio`/`combustivel`), então o
  usuário vê o erro antes do round-trip à API.
- **React Router** — guard de rota (`RequireAuth`) espera a checagem de sessão
  terminar antes de decidir entre renderizar a rota ou redirecionar, evitando o flash
  da tela de login a cada refresh.
- **Por que o token de sessão nunca é tocado em JavaScript** — a API usa sessão
  Sanctum em cookie `HttpOnly`, não Bearer token. O `AuthContext` guarda só o usuário
  autenticado (nome, e-mail, `is_admin`) em estado do React; o cookie de sessão em si é
  inacessível ao JavaScript por design, o que elimina XSS como vetor de roubo de
  sessão. `axios` é configurado com `withCredentials` + `withXSRFToken` para o
  navegador cuidar do cookie sozinho.

Mais detalhes e trade-offs em [`.claude/context/decisions.md`](.claude/context/decisions.md).

## Stack

- React 19, TypeScript, Vite
- MUI, TanStack Query, React Hook Form + Zod, React Router
- Lint: oxlint · Formatação: Prettier
- Autenticação: sessão Sanctum via cookie `HttpOnly` (mesmo modelo da API)
