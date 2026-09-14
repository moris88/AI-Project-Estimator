# AI Project Estimator

AI Project Estimator è uno strumento moderno basato sull'intelligenza artificiale progettato per aiutare gli sviluppatori e i project manager a generare stime di progetto accurate e dettagliate in pochi secondi.

Utilizzando modelli linguistici avanzati (LLM), l'applicazione analizza lo stack tecnologico, l'ambito del progetto e i requisiti specifici per fornire una suddivisione dei compiti, le tempistiche stimate e le note tecniche.

## ✨ Caratteristiche principali

- **Supporto Multi-Provider**: Scegli tra Google Gemini, OpenAI e Anthropic (Claude) per generare le tue stime.
- **Selezione Stack Tecnologico**: Selettore interattivo per definire le tecnologie principali del progetto.
- **Configurazione dell'Ambito**: Definisci se il progetto è Frontend, Backend, Fullstack o Mobile.
- **Generazione PDF**: Esporta le tue stime in un formato PDF professionale pronto per essere condiviso con i clienti.
- **Interfaccia Moderna**: UI pulita e reattiva costruita con React e Tailwind CSS.
- **Privacy First**: Le chiavi API sono salvate localmente nel `localStorage` dell'app e non vengono inviate a server intermedi.

## 🚀 Tecnologie utilizzate

- **Frontend**: React 19, TypeScript, Vite
- **Desktop**: Electron, electron-vite, electron-builder
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

3. Scegli la modalità di sviluppo nel file `.env`:

   ```dotenv
   VITE_APP="desktop"
   VITE_ENV="development"
   ```

   I valori supportati per `VITE_APP` sono:

   - `desktop`: avvia l'app Electron.
   - `web`: avvia solo l'app Vite nel browser.

4. Avvia l'applicazione:

   ```bash
   pnpm dev
   ```

   In modalità `web`, l'app è disponibile su `http://localhost:3000`. In modalità `desktop`, Electron carica il renderer su `http://localhost:5173`.

   Con `VITE_ENV="development"`, la finestra Electron apre automaticamente le DevTools.

## Distribuzione desktop

Genera gli archivi ZIP x64 per Windows e Linux nella cartella `dist`:

```bash
pnpm build:electron
```

Per impostare un'icona personalizzata, aggiungi alla configurazione `build` in `package.json` un PNG di almeno 256x256 pixel presente in `resources`.

## ⚙️ Configurazione

Per utilizzare l'applicazione, dovrai inserire le tue chiavi API nel pannello delle impostazioni dell'app:

- **Google Gemini**: Ottieni una chiave su [Google AI Studio](https://aistudio.google.com/).
- **OpenAI**: Ottieni una chiave sulla [piattaforma OpenAI](https://platform.openai.com/).
- **Anthropic**: Ottieni una chiave sulla [piattaforma Anthropic](https://console.anthropic.com/).

## 📝 Licenza

Questo progetto è distribuito sotto la licenza MIT. Vedere il file `LICENSE` per ulteriori dettagli.
