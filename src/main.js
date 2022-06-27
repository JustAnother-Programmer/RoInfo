const path = require('path')
const noblox = require('noblox.js')
const { app, BrowserWindow, ipcMain } = require('electron')

let win

const createWindow = () => {
    win = new BrowserWindow({
        icon: path.join(__dirname, 'public/images/icon.png'),
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);

    win.loadFile(path.join(__dirname, 'public/index.html'))
}

// Noblox functions
async function getUserIdFromName(username) {
    var userId = await noblox.getIdFromUsername(username)
    .then((res) => { return res })
    .catch(err => {
        console.log(err)
        win.webContents.send('fromMain', {success: false, error: 'Could not find user'})
    })

    return userId
}

async function getUserGroups(userId) {
    var groups = await noblox.getGroups(userId)
    .then((res) => { return res })
    .catch(err => {
        console.log(err)
        win.webContents.send('fromMain', {success: false, error: 'Could get groups'})
    })

    return groups
}

async function getGroupFromId(id) {
    var group = await noblox.getGroup(id)
    .then((res) => { return res })
    .catch(err => {
        console.log(err)
        win.webContents.send('fromMain', {success: false, error: 'Could get group from ID'})
    })

    return group
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
    var data = JSON.parse(args)
    var groupIds = data.ids
    
    // Get the userID
    getUserIdFromName(data.username).then(res => {
        // Get what groups the user is in
        getUserGroups(res).then(res2 => {
            var ids = []
            var names = []
            var userInGroupsIds = []
            var userInGroupsNames = []
            var notIn = []

            // Collect all of the IDs of the groups the user is in
            for (let i = 0; i < res2.length; i++) {
                ids.push(res2.at(i).Id)
                names.push(res2.at(i).Name)
            }

            // Check through the ids entered in the client side to see if they are in the grabbed IDs
            for (let i = 0; i < ids.length; i++) {
                if (groupIds.includes(ids[i].toString())) {
                    userInGroupsIds.push(ids[i])
                    userInGroupsNames.push(names[i])
                }
            }
            
            for (let i = 0; i < groupIds.length; i++) {
                if (!userInGroupsIds.toString().includes(groupIds[i])) {
                    getGroupFromId(parseInt(groupIds[i])).then(res3 => {
                        notIn.push(res3.name)
                        
                        // Should probably fix, its kinda dirty as it will send the event with data multiple times to the renderer
                        // It also massively increases the time but we move
                        win.webContents.send('fromMain', {success: true, data: {
                            numChecked: groupIds.length,
                            userIn: userInGroupsIds.length,
                            names: userInGroupsNames,
                            notInGroups: notIn
                        }})
                    })
                }
            }
        })
    })
})