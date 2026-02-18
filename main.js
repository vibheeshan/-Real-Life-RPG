// ═══════════════════════════════════════════════════════
// Real-Life RPG — Electron Main Process
// ═══════════════════════════════════════════════════════

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'Real-Life RPG',
        icon: path.join(__dirname, 'assets', 'icon.png'),
        backgroundColor: '#06060f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        // Premium window styling
        frame: true,
        autoHideMenuBar: true,
        show: false // Show after ready-to-show
    });

    // Load the app
    mainWindow.loadFile('index.html');

    // Show window when ready (avoids white flash)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in dev mode
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ── App Lifecycle ──────────────────────────────────────
app.whenReady().then(() => {
    createWindow();

    // macOS: re-create window when dock icon clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows closed (except macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
