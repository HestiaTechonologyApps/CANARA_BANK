# Architecture Overview — Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme (CBEU GJFWS)

> Auto-generated technical breakdown of the repository. Scope: frontend SPA under `CANARA_BANK/`.

## 1. Executive Summary

- **Core purpose:** A web application for the *Canara Bank Employees' Union — Golden Jubilee Family Welfare Scheme*. It presents public information (about the scheme, rules, downloads, claims settled, managing committee, news/quotes) and provides authenticated portals for **administrators** (`SystemAdmin`/`Administrator`) and **staff** (`OfficeStaff`/`DEO`) to manage members, contributions, claims, refunds, expenses, CMS content, and approvals.
- **Primary problems solved:** Digitizes record-keeping and workflows of a bank-employee welfare scheme — member onboarding, monthly/direct contributions, death-claim & refund processing, expense tracking, approvals, audit trails, attachments, and public-facing scheme information.
- **Target use case:** Internal staff/admin operations plus a public informational site, deployed as a static SPA (Azure Static Web Apps / SmarterASP.NET) backed by a separate REST API.

## 2. Tech Stack & Dependencies

- **Language:** TypeScript (`~5.9.3`), TSX. `strict` mode, `noEmit` (Vite bundles).
- **Runtime/build:** Node.js (CI uses Node 20), Vite `^7.2.4`, `@vitejs/plugin-react`.
- **UI:** React `^19.2.1`, React DOM, React Router DOM `^7.10.1`. Styling via Bootstrap `^5.3.8`, `react-bootstrap`, `bootstrap-icons`, custom CSS per portal.
- **Data/tables/forms:** `@tanstack/react-table`, `react-datepicker`, `react-calendar`, `react-clock`, `react-datetime-picker`, `react-time-picker`, `react-dropzone`, `react-bootstrap-time-picker`.
- **Charts/reports/export:** `recharts`, `jspdf`, `jspdf-autotable`, `html2canvas`, `react-csv`, `xlsx`, `react-to-print`.
- **UX/notifications:** `react-hot-toast`, `react-toastify`, `sweetalert2`, `lucide-react`, `react-icons`.
- **Auth/JWT:** `jsonwebtoken`, `jwt-decode` (client-side decode), token stored in `localStorage`.
- **Deployment tooling:** `basic-ftp` (deploy script), `env-cmd`, `cross-env`.
- **Lint:** ESLint `^9.39.1` with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **External services/APIs:** Backend REST API at `https://api.cbeugjfws.co.in/api` (default `VITE_API_BASE_URL`); image/file backend host `http://sreenathganga-001-site16.jtempurl.com`. No backend code in this repo.

## 3. Directory & Component Architecture

Top-level (under `CANARA_BANK/`):
```
src/
  main.tsx              # React root mount (StrictMode, YearProvider)
  App.tsx               # BrowserRouter, Toaster, AppRoutes
  Routes/AppRoutes.tsx  # Aggregates public/admin/staff route trees + 404
  ADMIN-PORTAL/         # Admin portal (components, layout, pages, routes, services, types)
  STAFF-PORTAL/         # Staff portal
  PUBLIC-PORTAL/        # Public site (layout, pages, auth, components, services, types)
  Components/           # Shared UI primitives (Kidu* form/table/validation/etc.)
  Services/             # Shared services (Http, Auth, Lookup, Pagination, Attachment, AuditLog, PublicService)
  CONSTANTS/            # API_ENDPOINTS, Version
  Types/                # Shared TS types (ApiTypes, Auth, Lookup, ...)
  assets/               # Static assets
public/                 # Static files (logos, web.config, downloadable PDFs)
scripts/deploy-ftp.mjs  # FTPS deploy helper
.github/workflows/      # Azure Static Web Apps + SmarterASP.NET FTP deploy
```

Core components/modules:
- **Entry & routing:** `main.tsx` → `App.tsx` → `Routes/AppRoutes.tsx` combines `publicRoutes`, `adminRoutes`, `staffRoutes`. Admin routes under `/dashboard` (ProtectedRoute roles SystemAdmin/Administrator); staff under `/staff-portal` (OfficeStaff/DEO).
- **Auth:** `Services/Auth.services.ts` (login/logout/register/forgot/change password, JWT + user in localStorage, role helpers, expiry check). `PUBLIC-PORTAL/Auth/ProtectedRoute.tsx` guards routes by role.
- **HTTP layer:** `Services/Http.services.ts` `HttpService.callApi` (fetch wrapper, Bearer token from localStorage, JSON/form-data, 401 handling).
- **API contract:** `CONSTANTS/API_ENDPOINTS.ts` (~325 lines) centralizes all backend endpoints; `Types/ApiTypes.ts` defines `CustomResponse<T>` (`isSucess`, `value`, ...).
- **Service layer:** per-entity services (Branch, Member, Contributions, Claims, Refunds, Expenses, CMS, Dashboard, Reports, Support Tickets, User/Role/Type, Settings masters) wrapping HttpService.
- **Shared UI primitives (`Components/Kidu*`):** `KiduCreate`, `KiduEdit`, `KiduView`, `KiduTable`, `KiduTableFilter`, `KiduValidation`, `KiduAuditLogs`, `KiduAttachments`, `KiduPopup`, `KiduLoader`, etc. provide reusable CRUD forms/tables/audit/attachments.
- **State/context:** `ADMIN-PORTAL/Layout/YearContext.tsx` (selected year) provided at root. Otherwise state is component-local; persistence via localStorage (auth) and backend.
- **Public content:** `Services/PublicService.ts` holds static copy/config (navbar, hero, about, rules, footer, privacy policy) used by public pages.

## 4. System Workflows & Data Flow

Entry points:
- Dev/build: `npm run dev` (Vite, opens browser), `npm run build` (`tsc && vite build`), lint `npm run lint`, preview `npm run preview`.
- Mode-specific: `start-admin/public/staff` and `build-admin/public/staff` (Vite `--mode`).
- SPA entry: `index.html` → `/src/main.tsx`.

Primary request flow:
1. Browser loads SPA; `main.tsx` mounts `YearProvider` + `App`.
2. `App.tsx` sets up `BrowserRouter`, global `Toaster`, renders `AppRoutes`.
3. Route resolution: public pages (no auth) or protected routes. Protected routes call `AuthService.isAuthenticated()` (token present, valid role, not expired); unauthorized → redirect to `/` with `showLogin`.
4. Pages invoke entity services → `HttpService.callApi` → `fetch` to `API_BASE_URL/...` with `Authorization: Bearer <jwt_token>` (unless `isPublic`).
5. Backend returns `CustomResponse<T>`; pages render via React state; errors surfaced via toast/Swal.
6. Auth login: `LoginModal` → `AuthService.login` POST `/Auth/login` (public) → stores `jwt_token`, `user`, `user_role`, `member_id`, `staff_no`, `token_expires_at` in localStorage → `getDashboardRoute()` redirects by role.
7. Admin CRUD: list pages use paged endpoints; create/edit pages use `KiduCreate`/`KiduEdit` with field definitions, validation, optional image upload, attachments, audit logs.
8. Public pages fetch CMS content via public services (day quotes, daily news, managing committee, downloads, claims settled stats).

## 5. Configuration & State Management

- **Env vars:** `VITE_API_BASE_URL` (backend API base; default `https://api.cbeugjfws.co.in/api`). Deploy secrets: `SMARTERASP_HOST`, `SMARTERASP_USER`, `SMARTERASP_PASSWORD`, `SMARTERASP_REMOTE_DIR`, `DEPLOY_LOCAL_DIR`, `CLEAN_DEPLOY`, `AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_WATER_00C2F8200`. `.env*` gitignored.
- **Config files:** `vite.config.ts` (minimal, React plugin), `tsconfig*.json`, `eslint.config.js`, `public/web.config` (IIS URL rewrite to `/` for SPA routing, JSON mime map).
- **State:** React component state (`useState`/`useEffect`); `YearContext` for selected year. Auth/session in `localStorage` (`jwt_token`, `user`, `user_role`, `member_id`, `staff_no`, `token_expires_at`). No global store (Redux not used despite dependency listing? `@reduxjs/toolkit` present in node_modules but not in package.json deps — likely transitive). Caching/persistence handled by backend; frontend refetches on navigation.

## 6. Developer & Deployment Operations

- **Scripts (package.json):** `dev` (vite --open), `build` (tsc && vite build), `lint` (eslint .), `preview` (vite preview), `start-admin/public/staff`, `build-admin/public/staff`, `deploy:smarterasp` (node scripts/deploy-ftp.mjs).
- **CI/CD:** `.github/workflows/azure-static-web-apps-...yml` (build & deploy to Azure Static Web Apps on push/PR to master, output `dist`). `.github/workflows/smarterasp-deploy.yml` (on push to `Production`: npm ci, npm run build, FTPS deploy `dist/` via SamKirkland/FTP-Deploy-Action).
- **Containerization:** None present (no Dockerfile). Static hosting only.
- **Testing:** No test framework/scripts configured (no Jest/Vitest in deps). Validation is manual/ESLint.

## Notes & Observations

- Frontend-only repository; backend API is external and not included here.
- Role model: `SystemAdmin`, `Administrator`, `OfficeStaff`, `DEO`.
- `src/Services/PublicService.ts` contains large static content blocks (about/rules/privacy) used as fallback/default copy.
- `getFullImageUrl` in `API_ENDPOINTS.ts` hardcodes a backend host for image resolution — a potential config smell.
- Vite config does not define env-specific entry points; mode-specific builds rely on `--mode` flags only (no custom rollup inputs), so admin/public/staff share one bundle.
- Source tree: ~387 files under `src/` (246 `.tsx`, 97 `.ts`), 162 admin page components.

