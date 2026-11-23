const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("windowControls", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
});

contextBridge.exposeInMainWorld("musicAPI", {
  songData: () => ipcRenderer.invoke("song:data"),
  folderData: () => ipcRenderer.invoke("song:allFolder"),
});

contextBridge.exposeInMainWorld("electronAPI", {
  folderPrompt: () => ipcRenderer.invoke("folder:prompt"),
  getPlayerInfo: () => ipcRenderer.invoke("get:playerInfo"),
  setPlayerInfo: (info) => ipcRenderer.invoke("set:playerInfo", info),
});
