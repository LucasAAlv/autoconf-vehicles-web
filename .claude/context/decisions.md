# Registro de Decisões Técnicas

Formato: Contexto → Decisão → Trade-off.

---

## ADR-001 — Dois repositórios: API REST + SPA

Exigência do desafio. `autoconf-vehicles-web` consome `autoconf-vehicles-api` só por
HTTP/JSON, sem monorepo, sem tipos compartilhados em tempo de compilação.
**Trade-off:** o contrato entre os dois vive só na documentação (Scribe/OpenAPI da API) e
nos tipos TypeScript deste repositório, escritos à mão a partir dela — sem garantia
automática de que os dois lados concordam.

## ADR-002 — Sessão Sanctum (cookie), nunca token em JavaScript

A API usa sessão stateful do Sanctum, não Personal Access Tokens. O front-end nunca lê nem
guarda o token de sessão: o cookie é `HttpOnly`, o axios manda `withCredentials` +
`withXSRFToken` e o navegador cuida do resto.
**Decisão:** `GET /sanctum/csrf-cookie` antes de login/registro, cookie `XSRF-TOKEN` lido
automaticamente pelo axios e devolvido como header `X-XSRF-TOKEN`. Estado de sessão (usuário
logado) vive em `AuthContext`, nunca em `localStorage`.
**Trade-off:** uma falha de XSS não consegue roubar a sessão — é o motivo principal da
escolha — mas o app depende de cookies same-site funcionando, então `SANCTUM_STATEFUL_DOMAINS`
e CORS da API precisam estar corretos ou a autenticação falha silenciosamente.

## ADR-003 — MUI como biblioteca de UI

Tabela, diálogo, snackbar e campos de formulário vêm prontos — os quatro são necessários
para o escopo do desafio (listagem, confirmação de exclusão, feedback de sucesso/erro,
formulário de veículo).
**Decisão:** MUI v7 (a v9, mais recente no npm, ainda quebra a tipagem de props de layout
como `Box`/`Stack` com o React 19 — v7 é a última major estável).
**Trade-off:** visual reconhecível de MUI; tema customizado (paleta, tipografia, raio de
borda) para não ficar com a cara default, mas sem refazer os componentes do zero.

## ADR-004 — TanStack Query para estado de servidor

Preferido a Redux/Zustand para este escopo — cache, paginação (`keepPreviousData`) e
invalidação por chave resolvem exatamente o que a listagem de veículos precisa, sem
reducers escritos à mão.
**Decisão:** `QueryClientProvider` na raiz, convenção de chave `['vehicles', params]`,
`['vehicle', id]`, `['auth', 'me']`.

## ADR-005 — React Hook Form + Zod, schema espelhando os Form Requests da API

O schema Zod do formulário de veículo replica as mesmas regras dos Form Requests Laravel
(regex de placa, tamanho do chassi, mínimos de `valor_venda`/`km`, enums de `cambio` e
`combustivel`) para dar feedback client-side antes do round-trip à API.
**Decisão:** erros 422 (`application/problem+json`, membro `errors`) mapeados para os campos
do formulário via `setError`; mensagens sem campo correspondente viram alerta geral.

## ADR-006 — Escopo cortado para MVP de um dia

O desafio previa 9 marcos com 32 issues. Como entrega é de curta duração, cada marco ficou
com uma única issue "guarda-chuva", absorvendo o essencial das demais; polimento
(máscaras de input, sincronismo de URL, Docker do front, CI, E2E) foi adiado.
**Trade-off:** cobertura de UX mais rasa do que o desafio pede (ex.: sem responsividade
dedicada, sem accessibility pass) em troca de um fluxo completo — login, CRUD, upload,
capa — realmente funcionando no fim do dia.

---

# Limitações conhecidas

- Sem testes automatizados no front-end (Playwright/Vitest) — adiado, fora do escopo do MVP.
- Sem modo escuro — paleta única, clara.
- Sem máscaras de input em `placa`/`valor_venda`/`km` — o desafio marca como opcional.
- Sem sincronismo de filtros/paginação com a URL — perde o "link compartilhável", mas não
  afeta o funcionamento da listagem.
