import path from "node:path";
import { app, BrowserWindow } from "electron";
let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration();

function createWindow() {
  console.log(">>> Creazione della finestra Electron in corso...");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // electron-vite imposta questa variabile solo durante il server di sviluppo.
  if (!app.isPackaged) {
    const devUrl = process.env.ELECTRON_RENDERER_URL || "http://localhost:5173";
    console.log(">>> Caricamento Dev URL:", devUrl);

    mainWindow.loadURL(devUrl);
    if (process.env.VITE_ENV === "development") {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app
  .whenReady()
  .then(() => {
    console.log(">>> Electron app è pronta.");
    createWindow();
  })
  .catch((err) => {
    console.error(">>> Errore durante app.whenReady:", err);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
