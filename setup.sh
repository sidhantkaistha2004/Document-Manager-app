#!/bin/bash

echo "========================================"
echo "Document Manager - Setup Script"
echo "========================================"
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Choose the LTS version and restart this script."
    exit 1
fi

echo "Node.js is installed. Version:"
node --version

echo
echo "Checking if dependencies are already installed..."
if [ -d "node_modules" ]; then
    echo "Dependencies found! Skipping installation."
    echo
    echo "========================================"
    echo "Setup completed successfully!"
    echo "========================================"
    echo
    echo "Starting Document Manager..."
    echo
    echo "Press Ctrl+C to stop the application"
    echo
    
    npm start
    exit $?
fi

echo
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
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

echo
echo "To run the application:"
echo "  npm start"
echo
echo "To build for distribution:"
echo "  npm run build"
echo 