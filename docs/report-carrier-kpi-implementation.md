# Carrier KPIs Implementation Report

Date: 2026-03-15
Author: Claude Code (co-authored by RuiFernandes)

## Summary
I implemented a carrier-facing KPIs page that mirrors the shipper KPIs UI but is backed by mocked tRPC endpoints (since the carrier DB data is not yet available). The implementation follows the project conventions (SSR prefetch + HydrateClient + KPIsView) and reuses the shipper UI components to minimize duplication.

Files added / modified
- Added: docs/plan-carrier-kpi.md (project plan)
- Added: src/modules/app/routes/carrier/server/kpis-procedures.ts (carrierKpis tRPC router with mocks)
- Added: src/modules/app/routes/carrier/pages/kpis/views/carrier-kpis-view.tsx (wrapper view that calls carrierKpis.report)
- Added: src/modules/app/routes/carrier/pages/kpis/views/carrier-tendencies-view.tsx (wrapper for tendencies/graphs)
- Modified: src/backend/trpc/routers/_app.ts (exported carrierKpis to appRouter)
- Modified: src/app/(carriers)/c/kpis/page.tsx (SSR page: prefetch report + trends, hydrate client)

Git commit
- Created a commit on local branch (commit id shown in shell): feat(carrier): add carrier KPIs page with mocked tRPC reports and trends
- Co-Authored-By: RuiFernandes

## Motivation & approach
- Goal: show carrier KPIs with the same UX as shipper KPIs while carrier DB pipelines are not ready.
- Strategy: keep the UI identical (reuse KPIsView and card/chart components), and provide a mock-backed tRPC router on the server side named `carrierKpis` that exposes the same inputs/outputs as the shipper procedures.
- This keeps mock logic on the server and leaves the frontend unchanged. When real carrier DB data is available, the server-side mock procedures can be replaced with real queries without touching UI code.

## Detailed steps performed
1. Exploration (discovery)
   - Read the existing shipper KPIs page and components to identify the data contract:
     - Main report: trpc.shipperKpis.report({ startDate, endDate, currency, section })
     - Trends/tendencies: trpc.shipperKpis.onTime, .incidents, .loading, .offloading
   - Identified fields consumed by tabs and charts (see "Required mock shape" below).

2. Add carrier tRPC router with mock data
   - Created `src/modules/app/routes/carrier/server/kpis-procedures.ts`.
   - Implemented `carrierKpis.report` which accepts the same input and returns section-specific objects (operational / incidents / costs / efficiency) matching what the UI expects.
   - Implemented mock tendencies endpoints:
     - `carrierKpis.onTime` → returns an array of { totalOnTime, total, date }
     - `carrierKpis.incidents` → returns { accidents, mechanical, docummentation, inspection }
     - `carrierKpis.loading` → returns an array of { load, date }
     - `carrierKpis.offloading` → returns an array of { offload, date }

3. Wire into appRouter
   - Modified `src/backend/trpc/routers/_app.ts` and exported `carrierKpis: carrierKpisRouter` so `trpc.carrierKpis` is available to both server and client code.

4. Create carrier wrapper views
   - `CarrierKPIsView` (client component) is a minimal clone of the shipper `KPIsView` but calls `trpc.carrierKpis.report` instead of shipper.
   - `CarrierTendenciesView` is a wrapper that calls the 4 carrier tendencies endpoints and reuses shipper chart/card components to render the graphs.
   - These wrappers preserve the UI while changing only the query namespace.

5. Implement SSR page with prefetch + hydration
   - Updated `src/app/(carriers)/c/kpis/page.tsx` to compute default last-30-days, prefetch carrierKpis.report and the four tendencies endpoints on the server using getQueryClient + client.prefetchQuery(...), then render the hydrated client with both `CarrierTendenciesView` and `CarrierKPIsView`.
   - Prefetching ensures SSR-rendered page is hydrated and avoids double load flashes.

6. Commit
   - Staged and committed the changes with a descriptive commit message and co-author.

## Required mock shape (fields the UI expects)
- Tabs (report) — depending on section:
  - operational: { trips, onTimeAtLoading, averageLoadingTime, averageTravelTime, distance, onTimeAtOffloading, averageOffloadingTime, demuragesOccurrences, damuragesChargedDays }
  - incidents: { trips, totalAccidents, mechanicalIssues, documentationIssues, policeIssues, percentageDamagedCargo, percentageComplaints }
  - costs: { trips, distance, weight, total }
  - efficiency: { trips, backload, emissions, total }
- Tendencies / Trends
  - onTime: [{ totalOnTime, total, date }]
  - incidents: { accidents, mechanical, docummentation, inspection }
  - loading: [{ load, date }]
  - offloading: [{ offload, date }]

## Where to look (file references)
- Page (carrier): src/app/(carriers)/c/kpis/page.tsx
- Carrier server router: src/modules/app/routes/carrier/server/kpis-procedures.ts
- App trpc router: src/backend/trpc/routers/_app.ts
- Carrier KPIs view (client wrapper): src/modules/app/routes/carrier/pages/kpis/views/carrier-kpis-view.tsx
- Carrier Tendencies view: src/modules/app/routes/carrier/pages/kpis/views/carrier-tendencies-view.tsx
- Plan: docs/plan-carrier-kpi.md

## How to verify locally
1. On your machine run:
   - pnpm typecheck
   - pnpm dev (or the project start command you use)
2. Open the app at the carrier KPIs route: http://localhost:3000/c/kpis
3. Check that:
   - The Performance Trends charts (line/bar/pie) render above the KPI tabs.
   - The KPI tabs show cards populated with numbers from the mocked report.
   - Switching tabs triggers network queries to `carrierKpis.report` with different `section` values.

## Notes, caveats and next steps
- Runtime verification: I could not run the dev server or typecheck here because Node/pnpm are not available in the execution environment. You should run checks locally.
- Translation keys: I reused shipper UI components that reference `Shipper.kpis...` translation keys. If you prefer separate translation namespaces for carriers, we should duplicate or parametrize those strings.
- Replace mocks with real queries: when the carrier DB schema/pipeline is ready, replace the mocked procedures in `carrier-kpis-procedures.ts` with DB queries (Drizzle ORM) mirroring the shipper implementation.
- Tests: consider adding a small integration test or Storybook entry for the carrier KPIs view to guard against regressions.

## Risk assessment
- Minimal risk to existing shipper code — we only added new files and exported the carrier router. We reused shipper UI components and did not change shipper server logic.
- Potential runtime mismatch: if the real carrier data has a different shape, UI display may show zeros or NaN fallbacks; ensure server returns fields with the same keys.

## Suggested follow-ups
- Add environment toggle (e.g., CARRIER_KPIS_MOCK) to switch between mock vs real backend during development.
- Extract common KPIs UI modules into a shared package (e.g., src/modules/kpis/) if you'll maintain separate shipper/carrier features long term.
- Add automated type coverage for tRPC outputs and component props to avoid silent shape mismatches.

---

If you want, I can open a PR with these changes and a short description, or push the branch to the remote. Tell me which remote branch name you prefer and whether to create the PR body automatically.
