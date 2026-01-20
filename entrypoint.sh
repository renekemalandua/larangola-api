#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application with Prisma Studio..."
npx prisma studio --hostname 0.0.0.0 &
exec node dist/main.js
