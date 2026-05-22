# Carambolo App

Aplicativo mobile da Carambolos em **Expo / React Native** (expo-router).
Cliente do backend Java (`carambolos-api`) e do servico de IA (`ai-service`).

## Setup

```bash
cd carambolo-app
npm install
```

Copie `.env.example` para `.env` e ajuste:

```bash
cp .env.example .env
```

| Variavel | Descricao |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL do backend Java (`http://localhost:8080`) |
| `EXPO_PUBLIC_AI_API_URL` | URL do AI service (`http://localhost:8000`) |

## Rodar

```bash
npm run start        # Metro bundler + escolha plataforma
npm run android      # roda direto no emulador Android
npm run ios          # roda direto no simulador iOS (macOS)
npm run web          # versao web
```

## Estrutura

```
carambolo-app/
├── app/                 # rotas expo-router (Dashboard, Assistant, Pedidos, ...)
│   └── Assistant.jsx    # chat com a Kuroko (insights, pills, confirmacao de acoes)
├── components/
│   ├── atoms/           # ChatBubble, botoes, badges
│   ├── molecules/       # AssistantHeader, ConfirmationActions, ChatInput
│   └── organisms/       # ChatMessages, InsightsPanel, PromptBar
├── hooks/               # useAssistant (TanStack Query), useChatStorage
├── services/
│   ├── api/             # axios instances (aiApi, jApi)
│   └── assistantService.js
└── assets/              # imagens / fontes
```

## Funcionalidades principais

- **Dashboard e pedidos** — integracao com o backend Java
- **Assistente Kuroko** — chat com insights, prompts sugeridos e relatorio PDF
- **Confirmacao de acoes** — quando a Kuroko propoe criar fornada ou pedido de bolo, aparecem botoes Confirmar/Cancelar; o commit vai direto ao `ai-service` (campo `confirmation` no `/ask`)
- **Chat persistido** — `useChatStorage` guarda sessao e mensagens em AsyncStorage (exceto a mensagem de boas-vindas)

## Dependencias principais

- `expo` ~54, `react-native` 0.81, `react` 19
- `expo-router` ~6 para navegacao baseada em arquivos
- `@tanstack/react-query` para fetch/cache
- `axios` para chamadas HTTP
- `@react-native-async-storage/async-storage` para persistir o chat

## Lint

```bash
npx eslint .
```

O `lint-staged` + `husky` rodam `eslint --fix` em arquivos JS/JSX no commit.
