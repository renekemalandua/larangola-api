# ===== STAGE 1: BUILD =====
FROM node:22-slim AS build

WORKDIR /app

# Install OpenSSL necessary for Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

# Generate Prisma and Build NestJS
RUN npx prisma generate
RUN npm run build

# ===== STAGE 2: RUNTIME =====
FROM node:22-slim

WORKDIR /app

# Install OpenSSL for runtime and clean apt cache
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd -m -r -g appuser appuser

RUN mkdir -p /app/prisma/migrations && chown -R appuser:appuser /app/prisma

COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appuser /app/dist ./dist
COPY --from=build --chown=appuser:appuser /app/prisma ./prisma
COPY --chown=appuser:appuser package*.json ./
COPY --chown=appuser:appuser entrypoint.sh ./

RUN chmod +x ./entrypoint.sh
USER appuser

EXPOSE 8000
CMD ["./entrypoint.sh"]
