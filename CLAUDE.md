# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bullhorn Career Portal — an Angular 10 + Angular Universal (SSR) application that serves as a public-facing job board powered by the Bullhorn REST API. Candidates search for jobs, view details, and apply with resume upload.

**Node version**: 16.13.1 (enforced in package.json)

## Commands

```bash
# Development
npm run serve              # Frontend-only dev server (static config, hash routing)
npm run dev:ssr            # SSR dev server with hot-reload (dynamic config)

# Production builds
npm run build              # Full SSR build (browser + server bundles)
npm run build:static       # Static HTML build (no Node.js runtime needed)
npm run build:qa           # QA environment build

# Run production server
npm start                  # node dist/career-portal/server/main.js (port 4000)

# Lint
npm run lint               # TSLint via ng lint

# E2E tests (Cypress — no unit tests in this repo)
npm run e2e                # Interactive Cypress
npm run e2e:ci             # Headless Cypress
npm run e2e:ci:qa          # Headless against QA build
npx cypress open           # Direct Cypress launcher
```

## Architecture

### SSR Data Flow

```
Request → Express (server.ts) → ngExpressEngine → AppServerModule renders HTML
  → TransferState serializes server data into HTML → Browser hydrates without re-fetching
```

TransferState is used for: settings (app.json), translations (i18n), and job data (JobResolver).

### Build Configurations

Four Angular build configs in `angular.json`, each selecting a different `app.json` and environment file:

| Config | Environment file | app.json source | Use case |
|--------|-----------------|-----------------|----------|
| `dev` | `environment.ts` | `src/app.json` | Local dev |
| `static` | `environment.static.ts` | `src/configuration/static/app.json` | Static hosting (S3, etc.) |
| `dynamic` | `environment.dynamic.ts` | `src/configuration/dynamic/app.json` | SSR production |
| `qa` | `environment.static.ts` | `src/configuration/qa/app.json` | QA testing |

Static builds use `useHash: true` (hash routing). Dynamic/SSR builds use `useHash: false`.

### Routing

Four routes in `app-routing.module.ts`:
- `/` → MainPageComponent (job list with sidebar filters)
- `/jobs/:id` → JobDetailsComponent (with JobResolver for data preloading)
- `/privacy` → PrivacyPolicyComponent
- `**` → redirects to `/`

### Key Services

| Service | Purpose |
|---------|---------|
| **SettingsService** | Loads `app.json` config at startup via APP_INITIALIZER; manages TransferState hydration; detects platform (server/browser) |
| **SearchService** | Queries Bullhorn public REST API (`public-rest{swimlane}.bullhornstaffing.com`); builds Lucene query strings for job search, filtering, pagination |
| **ApplyService** | Submits job applications with FormData (resume upload) to Bullhorn `/apply/{jobId}/raw` endpoint |
| **ShareService** | Generates social sharing URLs (Facebook, Twitter, LinkedIn, Email) |
| **AnalyticsService** | Google Analytics event tracking (browser-only, server-safe) |
| **ServerResponseService** | Sets HTTP status codes and cache headers during SSR |

### Configuration System

Runtime configuration lives in `app.json` (type: `ISettings` in `src/app/typings/settings.d.ts`). Key fields:
- `service.corpToken` / `service.swimlane` — Bullhorn API credentials (required)
- `service.batchSize`, `service.fields`, `service.jobInfoChips` — API query tuning
- `additionalJobCriteria` — restrict visible jobs by field/value
- `eeoc` — toggle gender/race/veteran/disability fields on apply form
- `privacyConsent` — consent checkbox and policy link config
- `integrations` — Google Analytics and Site Verification

The SSR server (`server.ts`) can override config via environment variables: `BULLHORN_SWIMLANE`, `BULLHORN_CORP_TOKEN`, `COMPANY_NAME`, `COMPANY_WEBSITE`, `COMPANY_LOGO_URL`, `HOSTED_ENDPOINT`, `GOOGLE_ANALYTICS_TRACKING_ID`, `GOOGLE_VERIFICATION_CODE`.

### i18n

Uses ngx-translate with 11 locales (`src/static/i18n/`): en, en-US, en-GB, fr, fr-FR, es, de, it, nl, ru, zh-CN. Custom `TranslationLoader` (`src/app/services/localization/loader.ts`) has two-tier fallback (language code → full locale) and TransferState hydration for SSR.

### Novo Elements

UI components come from a **forked snapshot** of [novo-elements](https://github.com/bullhorn/novo-elements) that excludes CKEditor/Dragula (see `package.json` GitHub dependency). This is a known quirk documented in `DEVELOPMENT.md`.

### Cypress Tests

Tests in `cypress/integration/` mock Bullhorn API responses via `cy.intercept()`:
- `spec.ts` — job list loading, category/state/city filtering, navigation to detail
- `job-detail.ts` — full apply flow (form fill, EEOC fields, resume upload, success verification)

Tests select elements by `data-automation-id` attributes.

## Patterns

- **Platform-safe services**: Check `SettingsService.isServer` before using browser APIs (window, localStorage, navigator)
- **Config-driven UI**: Apply form fields (EEOC), language options, job info chips, and resume types are all controlled by `app.json`
- **Trailing commas required**: TSLint enforces trailing commas on multiline and single-line (see `tslint.json`)
- **Interface prefix**: Interfaces must start with `I` (e.g., `ISettings`, `IServiceSettings`)
- **Single quotes**: TSLint enforces single-quoted strings
