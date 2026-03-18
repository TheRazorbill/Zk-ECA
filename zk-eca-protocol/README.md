# ZK-ECA Protocol Monorepo

Monorepo do protocolo ZK-ECA organizado para separar emissao, carteira e verificacao.

## Arquitetura

- `apps/issuer-proxy`: servidor Fastify que centraliza a conversa com Gov.br e emissoes/verificacoes de prova.
- `apps/mobile-wallet`: app Expo (React Native) para armazenar chave e montar prova no dispositivo do usuario.
- `apps/verifier-demo`: app Vite (React) que simula um verificador (ex.: Discord) solicitando prova de idade.
- `apps/docs`: app Next.js para documentacao e experimentos de UX/documentacao.
- `packages/crypto-core`: logica compartilhada de construcao/verificacao de payload de prova.
- `packages/ui`: componentes React compartilhados.
- `packages/eslint-config` e `packages/typescript-config`: padroes de lint e TypeScript para o workspace.

## Comandos uteis

```sh
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm check-types
```

## Rodando projetos especificos

```sh
pnpm --filter issuer-proxy dev
pnpm --filter mobile-wallet start
pnpm --filter verifier-demo dev
pnpm --filter docs dev
```
