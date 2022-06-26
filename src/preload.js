const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("api", {
    sendToMain: function(data) {
        ipcRenderer.send('toMain', data)
    },
    recieveFromMain: function(func) {
        ipcRenderer.on('fromMain', (event, ...args) => func(event, ...args))
    }
})