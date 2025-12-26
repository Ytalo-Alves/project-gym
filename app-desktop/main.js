const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

function createWindow() {
  const iconPath = path.join(__dirname, 'public', 'Logo.png');

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: iconPath,
    webPreferences: {
      contextIsolation: true
    }
  });

  const startUrl =
    process.env.ELECTRON_START_URL || 'http://localhost:3000/SignIn';

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'public', 'Logo.png');
  const icon = nativeImage.createFromPath(iconPath);

  if (process.platform === 'darwin' && !icon.isEmpty()) {
    app.dock.setIcon(icon);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
