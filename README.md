# Business Name Generator Backend

Backend-first NestJS service for generating and evaluating business names.

## Commands

- `npm run start:dev` starts the API locally.
- `npm run build` builds the service.
- `npm run lint` runs ESLint.
- `npm run test` runs the unit and e2e tests.
- `npm run test:openai` runs the live OpenAI smoke test when `OPENAI_API_KEY` is present.

## Docker

- `docker compose up --build` starts the API on `http://localhost:3000`.
- `GET /health` returns a simple health payload.

## API Workflow

The current backend is synchronous and backend-only. A typical flow is:

1. `POST /projects`
   Creates a project brief with the business description, optional seed names, target market, and preferences.
2. `POST /projects/:projectId/generate`
   Uses the generation service and OpenAI adapter to produce structured candidate names for the project.
3. `POST /projects/:projectId/evaluate`
   Runs deterministic evaluation across every generated candidate using the screening ports and ranking service.
4. `GET /projects/:projectId/results`
   Returns the project, latest generation run, and latest ranked evaluation result.

Example `POST /projects` body:

```json
{
  "businessDescription": "A naming platform for startup founders in the UK",
  "seedNames": ["North Ember"],
  "targetMarket": "UK",
  "tone": "modern",
  "industry": "software",
  "desiredLength": 2,
  "excludedWords": ["cheap"]
}
```

Example `POST /projects/:projectId/generate` body:

```json
{
  "candidateCount": 12
}
```

## Architecture

- Business logic remains in NestJS `services`.
- Services depend on ports.
- Adapters only translate to and from external systems.
- In-memory adapters are used first so Postgres and real external APIs can be introduced later.
