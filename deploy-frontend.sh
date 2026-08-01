#!/bin/bash
# Run these in order after Vercel login completes

# 1. Deploy frontend to Vercel (from /client folder)
npx vercel --prod \
  --name hackverse-app \
  --build-env VITE_API_URL=https://hackverse-api.onrender.com/api \
  --yes
