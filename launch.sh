#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    DOCUMENT MANAGER                          ║"
echo "║                        LAUNCHER                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

# Check if Node.js is installed
echo -e "${BLUE}[1/4]${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ ERROR: Node.js is not installed!${NC}"
    echo
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo "Choose the LTS version and restart this launcher."
    echo
    exit 1
fi
echo -e "${GREEN}✅ Node.js is installed${NC}"

# Check if dependencies exist
echo -e "${BLUE}[2/4]${NC} Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies found${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not found, installing...${NC}"
    
    # Install dependencies
    echo -e "${BLUE}[3/4]${NC} Installing dependencies..."
    npm install --silent
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ ERROR: Failed to install dependencies!${NC}"
        echo "Please check your internet connection and try again."
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Launch the app
echo -e "${BLUE}[4/4]${NC} Launching Document Manager..."
echo
echo -e "${GREEN}🚀 Starting application...${NC}"
echo -e "${YELLOW}📝 Press Ctrl+C to stop the application${NC}"
echo

# Launch the app
npm start

# If we get here, the app was closed
echo
echo -e "${BLUE}👋 Application closed.${NC}" 