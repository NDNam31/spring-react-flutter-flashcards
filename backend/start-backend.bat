@echo off
REM =====================================================
REM Start Backend with Gemini API Key
REM =====================================================

echo.
echo ========================================
echo   Flashcards Backend Startup Script
echo ========================================
echo.

REM Check if API key is set
if "%GEMINI_API_KEY%"=="" (
    echo [ERROR] GEMINI_API_KEY not set!
    echo.
    echo Please set your API key first:
    echo   1. Visit: https://aistudio.google.com/app/apikey
    echo   2. Create/Copy your API key
    echo   3. Run: set GEMINI_API_KEY=YOUR-API-KEY
    echo.
    echo Or run this script with: 
    echo   set GEMINI_API_KEY=YOUR-KEY ^&^& start-backend.bat
    echo.
    pause
    exit /b 1
)

echo [INFO] API Key found: %GEMINI_API_KEY:~0,20%...
echo [INFO] Starting backend on port 8080...
echo.

cd /d "%~dp0"
java -jar target\flashcards-backend-1.0.0.jar

pause
