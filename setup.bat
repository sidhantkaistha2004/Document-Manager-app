@echo off
echo ========================================
echo Document Manager - Setup Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Choose the LTS version and restart this script.
    pause
    exit /b 1
)

echo Node.js is installed. Version:
node --version

echo.
echo Checking if dependencies are already installed...
if exist "node_modules" (
    echo Dependencies found! Skipping installation.
    goto :run_app
)

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

:run_app
echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Starting Document Manager...
echo.
echo Press Ctrl+C to stop the application
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start the application!
    echo Please check the error messages above.
    pause
    exit /b 1
)

pause 