const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { parseFile } = require("music-metadata");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Geet",
    titleBarStyle: "hidden",
    resizable: true,
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      enableRemoteModule: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.webContents.once("dom-ready", () => {
      win.webContents.openDevTools();
      setTimeout(() => {
        win.webContents.reload();
      }, 500);
    });
  }
}

// Windows Controls

ipcMain.on("window:minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window:close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle("window:toggle-maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }

  return win.isMaximized();
});

ipcMain.handle("window:is-maximized", (event) => {
  return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
});

app.whenReady().then(async () => {
  if (isDev) {
    try {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");
      const name = await installExtension(REACT_DEVELOPER_TOOLS);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }
  createWindow();
});
