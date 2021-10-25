const { electron, BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js")
    }
  });

  win.setMenu(null);
  win.loadFile(path.join(__dirname, "./index.html"));

  // 開発ツールを有効化
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//IPCメッセージの受信部(レンダラープロセスから送られる)//
ipcMain.handle("msg_render_to_main", async(event, arg) => {
  console.log(arg); //printing "good job"
});
