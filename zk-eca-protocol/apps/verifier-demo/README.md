# verifier-demo

Aplicacao Vite + React que simula um verificador (ex.: Discord) solicitando prova de idade.

## Objetivo

Demonstrar o fluxo de verificacao consumindo a logica compartilhada de `@repo/crypto-core`.

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm check-types`

## Rodar localmente

No root do monorepo:

```sh
pnpm install
pnpm --filter verifier-demo dev
```

Abrir:

- http://localhost:5173

## O que esta demo mostra

1. Lado Servidor (sensivel): CPF e payload interno aparecem apenas no painel do issuer-proxy.
2. Lado Discord (minimizado): apenas token assinado + status de verificacao.
3. Log de Verificacao: narrativa pronta para print/video com foco em minimizacao de dados.

## Escopo atual da implementacao

- O painel "Servidor issuer-proxy" no `verifier-demo` e uma simulacao visual para demonstracao de minimizacao de dados.
- O backend real esta em `apps/issuer-proxy`, mas a tela demo ainda nao consome os endpoints via HTTP.

## Opcional: backend junto da demo

Em outro terminal (root do monorepo):

```sh
pnpm --filter issuer-proxy dev
```

Healthcheck:

- http://localhost:3002/health
