## Context
We already have a Shipper KPIs route at [src/app/(shipper)/s/(public)/kpis/page.tsx](src/app/(shipper)/s/(public)/kpis/page.tsx) that:
- computes default date range ("last 30 days")
- server-prefetches KPI data via tRPC into a TanStack Query client
- hydrates the cache to the client via <HydrateClient>
- renders a KPIsView that likely uses tRPC/react-query hooks to show the report

Goal: make the Carrier KPIs page mirror the shipper KPIs behavior and defaults (last 30 days, currency MZN, section operational), but backed by carrier KPI data.

## Recommended approach (multi-phase, with dependencies)

### Phase 0 — Recon / shape discovery (no behavior changes)
**Goal:** ensure the carrier API can mimic exactly what the existing shipper UI expects.

**Steps**
0.1 Read the shipper KPIs view entrypoint and enumerate what it consumes.
- UI entrypoint: `@/modules/app/routes/shipper/pages/kpis/views/kpis-view`
- Identify:
  - which tRPC procedure it calls (`trpc.shipperKpis.report`)
  - the exact input it passes (`{ startDate, endDate, currency, section }`)
  - the output fields each tab component reads (operational/incidents/costs/efficiency)

0.2 Read the shipper KPI server procedure and confirm its output schema.
- Backend source: `src/modules/app/routes/shipper/server/kpis-procedures.ts`

**Dependencies**
- None.

**Exit criteria**
- A checklist of required output fields for each section (enough to craft a compatible mock).

---

### Phase 1 — Carrier KPI API (mock-first)
**Goal:** create a carrier tRPC procedure that returns “shipper-report-shaped” mock payloads.

**Steps**
1.1 Create a carrier KPI router/procedure `carrierKpis.report`.
- Accept **the same input contract** as shipper (`startDate`, `endDate`, `currency`, `section`).

1.2 Implement mock report builder(s).
- Return data that matches the shipper report output shape.
- Because tabs fetch by `section`, it’s fine if the response varies per section, as long as each section’s payload satisfies what the UI reads.

1.3 Wire `carrierKpisRouter` into the app tRPC router.
- File: `src/backend/trpc/routers/_app.ts`
- Ensure it’s exported on both server (`@/backend/trpc/server`) and client `trpc` typings.

**Dependencies**
- Requires Phase 0 output-field checklist.

**Exit criteria**
- `trpc.carrierKpis.report.queryOptions(...)` exists and typechecks.

---

### Phase 2 — Carrier KPIs Next.js page (SSR prefetch + hydration)
**Goal:** add `/c/kpis` that mirrors the shipper page conventions and reuses the existing KPIs UI.

**Steps**
2.1 Implement the carrier page route.
- File: [src/app/(carriers)/c/kpis/page.tsx](src/app/(carriers)/c/kpis/page.tsx)
- Mirror shipper pattern:
  - compute default last-30-days range
  - `const client = getQueryClient()`
  - `await client.prefetchQuery(trpc.carrierKpis.report.queryOptions({ startDate, endDate, currency: "MZN", section: "operational" }))`
  - render `<HydrateClient><KPIsView startDate={startDate} endDate={endDate} /></HydrateClient>`

2.2 Add a lightweight wrapper view for carriers.
- Create `CarrierKPIsView` that:
  - reuses the same sections/components as the shipper KPIs view
  - swaps only the query hook to `trpc.carrierKpis.report.queryOptions(...)`
- This avoids route-based branching and keeps shipper KPIs untouched.

**Dependencies**
- Phase 1 must be complete (carrier tRPC proc must exist) before SSR prefetch compiles.
- For the UI selection (2.2), we may need a small refactor of KPIsView or a wrapper component.

**Exit criteria**
- `/c/kpis` renders without runtime errors and shows populated mock KPIs.

---

### Phase 3 — Verification
**Goal:** ensure the end-to-end behavior matches shipper KPIs UX.

**Steps**
3.1 Typecheck/build.

3.2 Run the app and validate the flow.
- Navigate to `/c/kpis`.
- Confirm:
  - defaults to last 30 days
  - initial server render is hydrated (no double-loading flashes beyond Suspense)
  - tab switching triggers `carrierKpis.report` with different `section`

**Dependencies**
- Depends on Phases 1–2.

**Exit criteria**
- Carrier KPIs page works end-to-end with mock data and matches shipper conventions.

## Critical files to inspect/modify
- Reference pattern: [src/app/(shipper)/s/(public)/kpis/page.tsx](src/app/(shipper)/s/(public)/kpis/page.tsx)
- Target route: [src/app/(carriers)/c/kpis/page.tsx](src/app/(carriers)/c/kpis/page.tsx)
- tRPC server utilities: `@/backend/trpc/server` (used by shipper page)
- KPI view: `@/modules/app/routes/shipper/pages/kpis/views/kpis-view` (imported by shipper page)
- Shipper procedure: `trpc.shipperKpis.report` (to mirror for carrier)

## Notes / assumptions (to confirm during implementation)
- `KPIsView` is reusable for carriers as-is; if it is shipper-specific internally, we will extract/parameterize minimally (only if needed).
- Carrier KPI report should match shipper report output shape; otherwise we may need a small adapter layer on the server.
