#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Find the main.js file
echo "Looking for main.js..."
if [ -f "dist/main.js" ]; then
    MAIN_FILE="dist/main.js"
    echo "Found: dist/main.js"
elif [ -f "dist/src/main.js" ]; then
    MAIN_FILE="dist/src/main.js"
    echo "Found: dist/src/main.js"
else
    echo "ERROR: main.js not found!"
    echo "Contents of dist/:"
    ls -la dist/ || echo "dist/ does not exist"
    echo "Contents of dist/src/:"
    ls -la dist/src/ 2>/dev/null || echo "dist/src/ does not exist"
    exit 1
fi

echo "Starting Prisma Studio..."
npx prisma studio --hostname 0.0.0.0 &

echo "Starting application: node $MAIN_FILE"
exec node "$MAIN_FILE"
