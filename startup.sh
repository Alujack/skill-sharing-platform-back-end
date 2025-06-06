#!/bin/sh

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Start the application
echo "Starting the application..."
npm run dev