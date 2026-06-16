# AI Project Estimator

AI Project Estimator è uno strumento moderno basato sull'intelligenza artificiale progettato per aiutare gli sviluppatori e i project manager a generare stime di progetto accurate e dettagliate in pochi secondi.

Utilizzando modelli linguistici avanzati (LLM), l'applicazione analizza lo stack tecnologico, l'ambito del progetto e i requisiti specifici per fornire una suddivisione dei compiti, le tempistiche stimate e le note tecniche.

## ✨ Caratteristiche principali

- **Supporto Multi-Provider**: Scegli tra Google Gemini, OpenAI e Anthropic (Claude) per generare le tue stime.
- **Selezione Stack Tecnologico**: Selettore interattivo per definire le tecnologie principali del progetto.
- **Configurazione dell'Ambito**: Definisci se il progetto è Frontend, Backend, Fullstack o Mobile.
- **Generazione PDF**: Esporta le tue stime in un formato PDF professionale pronto per essere condiviso con i clienti.
- **Interfaccia Moderna**: UI pulita e reattiva costruita con React e Tailwind CSS.
- **Privacy First**: Le tue chiavi API vengono salvate localmente nel browser (`localStorage`) e non vengono mai inviate a server intermedi.

## 🚀 Tecnologie utilizzate

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icone**: Lucide React
- **Generazione PDF**: @react-pdf/renderer
- **Linter/Formatter**: Biome
- **AI SDKs**: Gemini API, OpenAI SDK, Anthropic SDK

## 🛠️ Installazione

Assicurati di avere [Node.js](https://nodejs.org/) installato.

1. Clona il repository:

   ```bash
   git clone https://github.com/tuo-username/AI-Project-Estimator.git
   cd AI-Project-Estimator
   ```

2. Installa le dipendenze:

   ```bash
   pnpm install
   # oppure npm install / yarn install
   ```

3. Avvia l'applicazione in modalità sviluppo:

   ```bash
   pnpm dev
   ```

4. Apri il browser all'indirizzo `http://localhost:3000`.

## ⚙️ Configurazione

Per utilizzare l'applicazione, dovrai inserire le tue chiavi API nel pannello delle impostazioni dell'app:

- **Google Gemini**: Ottieni una chiave su [Google AI Studio](https://aistudio.google.com/).
- **OpenAI**: Ottieni una chiave sulla [piattaforma OpenAI](https://platform.openai.com/).
- **Anthropic**: Ottieni una chiave sulla [piattaforma Anthropic](https://console.anthropic.com/).

## 📝 Licenza

Questo progetto è distribuito sotto la licenza MIT. Vedere il file `LICENSE` per ulteriori dettagli.
