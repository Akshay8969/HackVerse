# HackVerse Backend Deploy Script
# Run this in a PowerShell terminal (NOT as admin needed)
# Pre-requisite: flyctl installed at ~/.fly/bin/flyctl.exe

$flyctl = "$env:USERPROFILE\.fly\bin\flyctl.exe"

Write-Host "=== HackVerse Backend Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "[1/4] Logging in to Fly.io (browser will open)..." -ForegroundColor Yellow
& $flyctl auth login

# Step 2: Launch app (first time only - sets up the app)
Write-Host ""
Write-Host "[2/4] Launching app on Fly.io..." -ForegroundColor Yellow
& $flyctl launch --name hackverse-api --region sin --no-deploy --yes

# Step 3: Set secrets (env vars)
Write-Host ""
Write-Host "[3/4] Setting environment variables..." -ForegroundColor Yellow
$mongoUri = Read-Host "Enter your MongoDB Atlas URI"
$jwtSecret = "hackverse_super_secret_jwt_key_2024_production"

& $flyctl secrets set `
  MONGO_URI="$mongoUri" `
  JWT_SECRET="$jwtSecret" `
  JWT_EXPIRE="7d" `
  NODE_ENV="production" `
  CLIENT_URL="https://hackverse-app.vercel.app"

# Step 4: Deploy
Write-Host ""
Write-Host "[4/4] Deploying..." -ForegroundColor Yellow
& $flyctl deploy --remote-only

Write-Host ""
Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Your API is live at: https://hackverse-api.fly.dev" -ForegroundColor Green
