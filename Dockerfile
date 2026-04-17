FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json jest.config.js eslint.config.mjs .prettierrc ./
COPY src ./src
COPY test ./test

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
