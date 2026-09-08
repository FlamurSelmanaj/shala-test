# Project guidance for Claude

Monorepo with `frontend/` (Angular) and `backend/`.

## Frontend rules

- **Ignore tests.** Do not write, update, run, or fix tests for the frontend
  (`frontend/**/*.spec.ts`, `ng test`, vitest). Skip test steps entirely — a
  change is "done" once it builds (`npm run build`).
- **Do not run the app.** Never start the dev server (`npm start` / `ng serve`)
  or otherwise launch the frontend. If a visual check is needed, ask the user to
  run it themselves.
