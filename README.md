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

## Architecture

- Business logic remains in NestJS `services`.
- Services depend on ports.
- Adapters only translate to and from external systems.
- In-memory adapters are used first so Postgres and real external APIs can be introduced later.
