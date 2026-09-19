# Phase 0 — Repository Audit & Baseline

## Goal contract

Establish an evidence-backed understanding of the existing repository and create independent ATHAR documentation without implementing Phase 1 features.

## Findings

- Static visual prototype; no framework, package manager metadata, TypeScript, server routes, database, authentication, payments, tests, or build tooling.
- `index.html` owns the landing page and inline vanilla-JS behaviours.
- CSS is layered and override-heavy: five stylesheets, widespread `!important`, overlapping hero/header definitions, and breakpoint rules split across files.
- Current asset scans resolve all local image/style references used by `index.html`.
- Current repository status includes pre-existing modified, deleted, and untracked prototype assets/styles. These changes were preserved and not treated as Phase 0 work.

## Risks and technical debt

1. Cascading override layers make visual changes fragile and hard to reason about.
2. Placeholder fragment links and UI controls can imply unimplemented commerce/account capabilities.
3. Third-party brand/product references and imagery require licensing/merchandising confirmation before production use.
4. Google Fonts add external runtime dependency and require production privacy/performance consideration.
5. No test, build, lint, accessibility, or security baseline exists.

## Implementation ledger

| Item | Status | Evidence |
| --- | --- | --- |
| Audit repository and stack | Complete | `PROJECT-STATUS.md` |
| Map page, styles, assets, and interactions | Complete | This document and `ARCHITECTURE.md` |
| Create documentation architecture | Complete | `docs/` baseline |
| Run safe checks | Complete | `PROJECT-STATUS.md` baseline evidence |
| Implement Phase 1 | Not started | Owner decision boundary |

## Sign-off

**IMPLEMENTED — NOT YET OWNER-VERIFIED.** Owner approval is required to select the production foundation and proceed to Phase 1.
