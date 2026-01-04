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
FROM node:22.21.1-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json .

RUN npm ci --omit=dev

EXPOSE 8000

CMD ["node", "dist/main.js"]
