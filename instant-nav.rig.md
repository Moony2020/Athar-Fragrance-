# instant-nav rig: ATHAR

- BUILD: `$env:EXPOSE_TESTING_API='1'; npm run build`
- EXPOSE: `EXPOSE_TESTING_API=1` only during the measured local build; production builds leave it unset.
- RUN: Start the freshly built artifact with `npm run start -- --hostname 127.0.0.1 --port 3100`; then run `$env:BASE_URL='http://127.0.0.1:3100'; npm run test:instant`.
- TEST USER: public; no authentication. State: no flags, no role, no seeded data, default locale.
- DRIFT: none known. The current foundation route has no user-specific state or external data.
- CONTRACTS: `/`, initial load, shell marker is the `ATHAR` heading; no deferred marker exists until a data-backed feature is introduced.
- LOOP: build with testing API → start the new local artifact on port 3100 → run focused Playwright test → stop server → edit → repeat. Agent can perform all local steps.
- LIVENESS: n/a; local artifact is freshly built and started.
- WALLS: npm's system prefix is protected on Windows. Project installs use the locally working npm configuration; Agent Browser is installed in the user-level prefix and invoked through its verified Node entry point.
