@echo off
title Document Manager Launcher
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                    DOCUMENT MANAGER                          ║
echo  ║                        LAUNCHER                              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from: https://nodejs.org/
    echo Choose the LTS version and restart this launcher.
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Check if dependencies exist
echo [2/4] Checking dependencies...
if exist "node_modules" (
    echo ✅ Dependencies found
    goto :launch
) else (
    echo ⚠️  Dependencies not found, installing...
)

:: Install dependencies
echo [3/4] Installing dependencies...
npm install --silent
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

:launch
echo [4/4] Launching Document Manager...
echo.
echo 🚀 Starting application...
echo 📝 Press Ctrl+C to stop the application
echo.

:: Launch the app
npm start

:: If we get here, the app was closed
echo.
echo 👋 Application closed.
pause 