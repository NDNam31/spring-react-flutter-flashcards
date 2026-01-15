# =====================================================
# Start Backend with Gemini API Key
# =====================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Flashcards Backend Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if API key is set
if (-not $env:GEMINI_API_KEY) {
    Write-Host "[ERROR] GEMINI_API_KEY not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your API key first:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://aistudio.google.com/app/apikey" -ForegroundColor White
    Write-Host "  2. Create/Copy your API key" -ForegroundColor White
    Write-Host "  3. Run in PowerShell:" -ForegroundColor White
    Write-Host '     $env:GEMINI_API_KEY="YOUR-API-KEY"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again: .\start-backend.ps1" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

$apiKeyPreview = $env:GEMINI_API_KEY.Substring(0, [Math]::Min(20, $env:GEMINI_API_KEY.Length))
Write-Host "[INFO] API Key found: $apiKeyPreview..." -ForegroundColor Green
Write-Host "[INFO] Starting backend on port 8080..." -ForegroundColor Green
Write-Host ""

# Start backend
Push-Location $PSScriptRoot
java -jar target\flashcards-backend-1.0.0.jar
Pop-Location
