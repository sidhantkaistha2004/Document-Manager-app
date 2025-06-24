# 🚀 Document Manager - Quick Launch Guide

## 📁 **Available Launcher Scripts**

### **Windows Users:**

#### **1. `launch.bat` - One-Click Launcher (Recommended)**
- **What it does**: Everything automatic - checks Node.js, installs dependencies, and launches the app
- **How to use**: Just double-click `launch.bat`
- **Features**: 
  - ✅ Beautiful colored interface
  - ✅ Automatic dependency checking
  - ✅ Smart installation (skips if already installed)
  - ✅ Error handling with clear messages

#### **2. `setup.bat` - Setup + Launch**
- **What it does**: First-time setup and launch
- **How to use**: Run once for initial setup
- **Features**: 
  - ✅ Installs dependencies if needed
  - ✅ Launches app automatically after setup

#### **3. `run.bat` - Quick Launch**
- **What it does**: Just launches the app (assumes setup is done)
- **How to use**: For daily use after initial setup
- **Features**: 
  - ✅ Fast startup
  - ✅ Checks if dependencies exist

### **Mac/Linux Users:**

#### **1. `launch.sh` - One-Click Launcher (Recommended)**
- **What it does**: Everything automatic with colored output
- **How to use**: 
  ```bash
  chmod +x launch.sh
  ./launch.sh
  ```

#### **2. `setup.sh` - Setup + Launch**
- **What it does**: First-time setup and launch
- **How to use**: 
  ```bash
  chmod +x setup.sh
  ./setup.sh
  ```

#### **3. `run.sh` - Quick Launch**
- **What it does**: Just launches the app
- **How to use**: 
  ```bash
  chmod +x run.sh
  ./run.sh
  ```

## 🎯 **Quick Start Guide**

### **First Time Setup:**
1. **Windows**: Double-click `launch.bat`
2. **Mac/Linux**: 
   ```bash
   chmod +x launch.sh
   ./launch.sh
   ```

### **Daily Use:**
1. **Windows**: Double-click `run.bat` or `launch.bat`
2. **Mac/Linux**: 
   ```bash
   ./run.sh
   # or
   ./launch.sh
   ```

## 🔧 **What Each Script Does**

### **launch.bat/launch.sh (Recommended)**
```
[1/4] ✅ Check Node.js installation
[2/4] ✅ Check if dependencies exist
[3/4] ✅ Install dependencies (if needed)
[4/4] ✅ Launch Document Manager
```

### **setup.bat/setup.sh**
```
✅ Check Node.js installation
✅ Install dependencies (always)
✅ Launch Document Manager
```

### **run.bat/run.sh**
```
✅ Check Node.js installation
✅ Check if dependencies exist
✅ Launch Document Manager
```

## 🎨 **Features**

- **Smart Detection**: Automatically detects if dependencies are already installed
- **Error Handling**: Clear error messages with instructions
- **Colored Output**: Easy-to-read status messages
- **One-Click**: No manual commands needed
- **Cross-Platform**: Works on Windows, Mac, and Linux

## 🚨 **Troubleshooting**

### **"Node.js not found"**
- Download and install Node.js from https://nodejs.org/
- Choose the LTS version
- Restart your computer
- Run the launcher again

### **"Dependencies not found"**
- Run `launch.bat` or `launch.sh` - it will install them automatically

### **"Permission denied" (Linux/Mac)**
- Make scripts executable: `chmod +x *.sh`
- Or run with sudo: `sudo ./launch.sh`

### **"Port already in use"**
- Close other applications using the same port
- Or restart your computer

## 💡 **Pro Tips**

1. **Create Desktop Shortcut**: Right-click `launch.bat` → "Create shortcut" → Move to desktop
2. **Pin to Taskbar**: Right-click the shortcut → "Pin to taskbar"
3. **Auto-start**: Add `launch.bat` to Windows startup folder

## 🎉 **Enjoy!**

The Document Manager will now:
- ✅ Open local files directly
- ✅ Store document information
- ✅ Search across all fields
- ✅ Work completely offline
- ✅ Look professional and modern

Just double-click and enjoy! 🚀 