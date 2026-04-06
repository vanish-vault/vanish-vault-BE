# ─────────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including devDependencies for tsc)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN yarn build


# ─────────────────────────────────────────────
# Stage 2: Production
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production-only deps + netcat for DB wait
COPY package.json yarn.lock ./
RUN apk add --no-cache netcat-openbsd \
    && yarn install --frozen-lockfile --production \
    && yarn cache clean

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Copy entrypoint script and make it executable
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose the application port (matches PORT env var, default 4000)
EXPOSE 4000

# Runs: wait for DB → migrations → optional seed → server
CMD ["sh", "entrypoint.sh"]
