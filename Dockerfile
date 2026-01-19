# ===== STAGE 1: BUILD =====
FROM node:22.21.1 AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# ===== STAGE 2: RUNTIME =====
FROM node:22.21.1

WORKDIR /app

# Install OpenSSL and dependencies (Required for Prisma Client)
RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && update-ca-certificates

RUN groupadd -r appuser && useradd -m -r -g appuser appuser

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh
RUN mkdir -p /app/prisma/migrations && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["./entrypoint.sh"]
