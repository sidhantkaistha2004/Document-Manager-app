# Document Manager - Electron Solution

## 🔧 **Why the Error Occurs**

The error you're seeing happens because **browsers cannot directly access local files** on your computer. This is a security feature to protect users from malicious websites.

## 🚀 **Solution: Electron Desktop App**

I've created an **Electron version** that can access local files directly. Here's how to set it up:

## 📦 **Installation Steps**

### **1. Install Node.js**
First, make sure you have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS version

### **2. Install Dependencies**
Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

### **3. Run the Application**
```bash
npm start
```

### **4. Build for Distribution (Optional)**
```bash
npm run build
```

## 🎯 **How It Works**

### **File Selection**
- Uses native file dialogs instead of browser file inputs
- Gets real file paths that can be opened later
- Supports file type filtering

### **File Opening**
- Opens files with the default system application
- Works with any file type (PDF, Word, Excel, images, etc.)
- No browser security restrictions

### **Data Storage**
- Documents are stored locally using localStorage
- File paths are preserved for future access
- Works offline

## 📁 **File Structure**

```
Document Manager/
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script-electron.js      # Electron JavaScript
├── main.js                 # Electron main process
├── package.json            # Node.js configuration
└── README-ELECTRON.md      # This file
```

## 🔄 **Alternative Solutions**

### **Option 1: Use a Local Server**
If you prefer to keep it as a web app:

```bash
# Install a simple HTTP server
npm install -g http-server

# Run the server
http-server -p 8080

# Open http://localhost:8080 in your browser
```

### **Option 2: Use Python Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### **Option 3: Use Live Server (VS Code Extension)**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"npm not found"**
   - Install Node.js from https://nodejs.org/

2. **"electron not found"**
   - Run `npm install` in the project folder

3. **"Permission denied"**
   - On Windows: Run as Administrator
   - On Mac/Linux: Use `sudo npm install`

4. **"Port already in use"**
   - Change the port in the server command
   - Or kill the process using that port

## 📋 **Features in Electron Version**

✅ **Real file path access**
✅ **Native file dialogs**
✅ **Direct file opening**
✅ **Offline functionality**
✅ **Cross-platform support**
✅ **Professional desktop app**

## 🎨 **Customization**

### **Change App Icon**
1. Add your icon files to `assets/` folder:
   - `icon.ico` (Windows)
   - `icon.icns` (Mac)
   - `icon.png` (Linux)

### **Modify Window Size**
Edit `main.js`:
```javascript
mainWindow = new BrowserWindow({
    width: 1400,  // Change width
    height: 900,  // Change height
    // ... other options
});
```

### **Add File Type Filters**
Edit `main.js` in the `select-file` handler:
```javascript
filters: [
    { name: 'Your Custom Type', extensions: ['ext1', 'ext2'] }
]
```

## 🔒 **Security Notes**

- The Electron app runs with full file system access
- Only install from trusted sources
- Keep the app updated for security patches

## 📞 **Support**

If you encounter issues:

1. Check that Node.js is installed correctly
2. Ensure all dependencies are installed (`npm install`)
3. Try running with `npm run dev` for debug mode
4. Check the console for error messages

## 🎉 **Benefits of Electron Solution**

- **No browser restrictions**
- **Native file system access**
- **Professional desktop experience**
- **Cross-platform compatibility**
- **Offline functionality**
- **Better performance**

The Electron version solves the local file access issue completely and provides a much better user experience! 