const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')

let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(path.join(__dirname, 'public/index.html'))
}

// Events
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('toMain', (event, args) => {
    console.log(`Args: ${args}`)

    // TODO: Process using roblox api in here and returrn the data to the renderer for display

    win.webContents.send('fromMain', {success: true, data: 'yes'})
})