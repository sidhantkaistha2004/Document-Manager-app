#!/bin/bash

echo "========================================"
echo "Document Manager - Quick Launch"
echo "========================================"
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please run setup.sh first to install Node.js and dependencies."
    exit 1
fi

echo "Checking if dependencies are installed..."
if [ ! -d "node_modules" ]; then
    echo "ERROR: Dependencies not found!"
    echo "Please run setup.sh first to install dependencies."
    exit 1
fi

echo
echo "Starting Document Manager..."
echo
echo "Press Ctrl+C to stop the application"
echo

npm start

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Failed to start the application!"
    echo "Please check the error messages above."
    exit 1
fi 