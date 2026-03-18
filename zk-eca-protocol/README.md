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

## Como testar a demo de Minimizacao de Dados

Passo a passo rapido para abrir a tela dividida (Servidor x Discord):

```sh
pnpm install
pnpm --filter verifier-demo dev
```

Abra no navegador:

- http://localhost:5173

O que validar na tela:

1. Painel esquerdo (Servidor issuer-proxy): aparece CPF e payload interno sensivel.
2. Painel direito (Discord/verifier): recebe apenas token assinado e status de aprovacao.
3. Log de Verificacao: destaca explicitamente o fluxo de minimizacao de dados.

Observacao importante:

- No estado atual, o painel "Servidor issuer-proxy" dentro do `verifier-demo` e uma simulacao visual para narrativa de produto (video/print).
- O backend real existe em `apps/issuer-proxy` e pode ser executado em paralelo, mas a UI da demo ainda nao faz chamada HTTP para ele.

## Opcional: subir o issuer-proxy em paralelo

Se quiser deixar o backend pronto enquanto demonstra:

```sh
pnpm --filter issuer-proxy dev
```

URL padrao do serviço:

- http://localhost:3002/health
