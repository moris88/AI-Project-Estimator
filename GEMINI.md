# AI Project Estimator - Project Overview

## Description
**AI Project Estimator** is a specialized tool designed to generate comprehensive project estimates using LLMs (Large Language Models). It helps developers and project managers quickly create detailed task breakdowns, effort estimations, and technical notes based on a project's tech stack and scope.

## Core Capabilities
- **Multi-Provider AI Support**: Integrates with Google Gemini, OpenAI, and Anthropic.
- **Dynamic Scoping**: Tailors estimates for Frontend, Backend, Fullstack, or Mobile projects.
- **Tech Stack Analysis**: Analyzes selected technologies to provide context-aware effort estimations.
- **Professional PDF Export**: Generates client-ready PDFs using `@react-pdf/renderer`.
- **Local-First Privacy**: API keys are stored securely in the browser's `localStorage`.

## Tech Stack
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Linting/Formatting**: Biome
- **AI Integration**: Official SDKs for Google Generative AI, OpenAI, and Anthropic.

## Project Structure
- `src/components/`: UI components including the multi-step form, result view, and PDF template.
- `src/hooks/`: Business logic for estimation generation (`useEstimate`).
- `src/lib/`: API clients and prompt engineering logic.
- `src/types/`: Centralized TypeScript definitions.
- `src/utils/`: Helper functions like Tailwind class merging.

## Development Workflow
- **Lint/Format**: `pnpm check` or `pnpm lint` / `pnpm format`.
- **Build**: `pnpm build`.
- **Dev Server**: `pnpm dev`.

---
*Created and maintained by Maurizio Tolomeo.*
