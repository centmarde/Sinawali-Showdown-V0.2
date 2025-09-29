// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");

let mainWindow; // Declare mainWindow outside the function to access it later

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/dist/index.html'));

  // Open the DevTools (optional, for debugging)
  // mainWindow.webContents.openDevTools();

  // Log the current URL when the page finishes loading
  mainWindow.webContents.once("did-finish-load", () => {
    console.log("Current URL: ", mainWindow.webContents.getURL());
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
