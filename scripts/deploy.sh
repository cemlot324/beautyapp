#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Run tests if you have them
# npm run test

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod 