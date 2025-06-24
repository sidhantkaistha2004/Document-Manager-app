const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        title: 'Document Manager',
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.disableHardwareAcceleration();
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers for file operations
ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'All Files', extensions: ['*'] },
            { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'ppt', 'pptx', 'xls', 'xlsx', 'csv'] },
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'] },
            { name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp'] },
            { name: 'Audio', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'] },
            { name: 'Archives', extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'] },
            { name: 'Code Files', extensions: ['js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'json', 'xml'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const stats = fs.statSync(filePath);
        const extension = path.extname(filePath).toLowerCase().replace('.', '');
        return {
            path: filePath,
            name: path.basename(filePath),
            size: stats.size,
            type: extension
        };
    }
    return null;
});

ipcMain.handle('open-file', async (event, filePath) => {
    try {
        // Check if file exists
        if (fs.existsSync(filePath)) {
            // Open file with default system application
            await shell.openPath(filePath);
            return { success: true, message: 'File opened successfully' };
        } else {
            return { success: false, message: 'File not found' };
        }
    } catch (error) {
        return { success: false, message: `Error opening file: ${error.message}` };
    }
});

ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const extension = path.extname(filePath).toLowerCase().replace('.', '');
            return {
                exists: true,
                path: filePath,
                name: path.basename(filePath),
                size: stats.size,
                type: extension,
                modified: stats.mtime,
                created: stats.birthtime
            };
        } else {
            return { exists: false };
        }
    } catch (error) {
        return { exists: false, error: error.message };
    }
});

ipcMain.handle('open-file-location', async (event, filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            shell.showItemInFolder(filePath);
            return { success: true };
        } else {
            return { success: false, message: 'File not found' };
        }
    } catch (error) {
        return { success: false, message: `Error showing file: ${error.message}` };
    }
});

ipcMain.handle('show-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        title: 'Select a file to open'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Helper function to get info for a single file
function getFileInfo(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                return null; // Ignore directories in this specific function
            }
            const extension = path.extname(filePath).toLowerCase().replace('.', '');
            return {
                exists: true,
                path: filePath,
                name: path.basename(filePath),
                size: stats.size,
                type: extension,
                modified: stats.mtime,
                created: stats.birthtime
            };
        }
    } catch (error) {
        console.error(`Error getting file info for ${filePath}:`, error);
    }
    return { exists: false };
}

// Helper function to recursively read files in a directory
function readFolderRecursively(folderPath) {
    let allFiles = [];
    try {
        const items = fs.readdirSync(folderPath);
        for (const item of items) {
            const fullPath = path.join(folderPath, item);
            try {
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    allFiles = allFiles.concat(readFolderRecursively(fullPath));
                } else {
                    allFiles.push(fullPath);
                }
            } catch (statError) {
                console.error(`Could not stat file ${fullPath}:`, statError);
            }
        }
    } catch (error) {
        console.error(`Error reading folder recursively: ${error.message}`);
    }
    return allFiles;
}

ipcMain.handle('process-dropped-paths', async (event, paths) => {
    const fileInfos = [];
    for (const p of paths) {
        try {
            const stats = fs.statSync(p);
            if (stats.isDirectory()) {
                const filesInDir = readFolderRecursively(p);
                for (const filePath of filesInDir) {
                    const info = getFileInfo(filePath);
                    if (info && info.exists) {
                        fileInfos.push(info);
                    }
                }
            } else {
                const info = getFileInfo(p);
                if (info && info.exists) {
                    fileInfos.push(info);
                }
            }
        } catch(error) {
            console.error(`Error processing path ${p}:`, error);
        }
    }
    return fileInfos;
});

// For clicking the drop-zone
ipcMain.handle('show-multi-open-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'openDirectory', 'multiSelections'],
        title: 'Select Files or Folders'
    });

    if (result.canceled || result.filePaths.length === 0) {
        return []; // Return empty array if dialog is cancelled
    }

    // Reuse the same processing logic by calling the handler directly
    const handle = ipcMain.getHandler('process-dropped-paths');
    return handle(null, result.filePaths);
}); 