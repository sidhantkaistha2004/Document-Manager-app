@echo off
echo ========================================
echo Document Manager - Quick Launch
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please run setup.bat first to install Node.js and dependencies.
    pause
    exit /b 1
)

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo ERROR: Dependencies not found!
    echo Please run setup.bat first to install dependencies.
    pause
    exit /b 1
)

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