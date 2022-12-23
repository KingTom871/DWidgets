const
{
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    Notification,
    shell,
    dialog,
    Tray,
    Menu,
    session
} = require('electron')


var mainWin = null
var show = false
app.on('ready', () =>
{
    // Notify
    new Notification(
    {
        title: 'DWidgets',
        body: 'DWidgets 正在运行\n按下 Alt + D 来唤醒我吧!'
    }).show()
    // Window
    mainWin = new BrowserWindow(
    {
        x: 0,
        y: 0,
        width: 680,
        height: 1038,
        frame: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWin.hide()
    // mainWin.webContents.openDevTools()
    //Tray
    const tray = new Tray(__dirname+'./assets/app/favicon.ico')
    const trayTemplate = Menu.buildFromTemplate([
    {
        label: '退出',
        click: () =>
        {
            mainWin.close()
        }
    }])
    tray.setToolTip('DWidgets')
    tray.on('click', () =>
    {
        if (show == true)
        {
            show = false
            mainWin.webContents.send('win-animation', '0')
            setTimeout(() =>
            {
                mainWin.hide()
            }, 200)
        }
        else
        {
            mainWin.show()
            show = true
            setTimeout(() =>
            {
                mainWin.webContents.send('win-animation', '1')
            }, 200)
        }
    })
    tray.on('right-click', () =>
    {
        tray.popUpContextMenu(trayTemplate)
    })

    // Alt + D to show
    globalShortcut.register('alt+d', () =>
    {
        if (show == true)
        {
            show = false
            mainWin.webContents.send('win-animation', '0')
            setTimeout(() =>
            {
                mainWin.hide()
            }, 200)
        }
        else
        {
            mainWin.show()
            show = true
            mainWin.webContents.send('win-animation', '1')
        }
    })
    var menushow = true
    globalShortcut.register('alt+t', () =>
    {
        if (menushow == true)
        {
            mainWin.webContents.send('setMenu', '0px')
            menushow = false
        }
        else
        {
            mainWin.webContents.send('setMenu', '40px')
            menushow = true
        }
    })
    //Reset
    ipcMain.on('reset', (event, data) =>
    {
        mainWin.setPosition(0, 0)
    })
    //Open url
    ipcMain.on('open-url', (event, url) =>
    {
        shell.openExternal(url);
    });
    // Choose file
    ipcMain.on('openFile', (event, data) =>
        {
            dialog.showOpenDialog(
            {
                title: '选择文件',
                filters: [{ name: 'file', extensions: data }]
            }).then((result) =>
            {
                if (result.filePaths != '')
                {
                    mainWin.webContents.send('openFileCallback', result.filePaths)
                }
            }).catch((err) =>
            {
                console.log(err)
            })
        }),
        //Cookie
        ipcMain.on('cookies', (event, data) =>
        {
            var cookies = new BrowserWindow(
            {
                width: 800,
                height: 600,
                webPreferences:
                {
                    nodeIntegration: true
                }
            })
            Menu.setApplicationMenu(null)
            cookies.loadURL('https://passport.bilibili.com/login')
            cookies.on('close', () =>{
                session.defaultSession.cookies.get({ url: '' })
                    .then((cookie) =>
                    {
                        mainWin.webContents.send('cookie_data', cookie)
                        cookies = null
                    })
            })
        })
    //Setting
    var settings_hasopen = false
    ipcMain.on('setting', (event, data) =>
    {
        if (settings_hasopen != true)
        {
            settings_hasopen = true
            var settings = new BrowserWindow(
            {
                width: 600,
                height: 810,
                resizable: false,
                parent: 'mainWin',
                modal: true,
                webPreferences:
                {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            })
            // settings.webContents.openDevTools()
            Menu.setApplicationMenu(null)
            settings.loadFile('./setting.html')
            // settings.loadURL('http://127.0.0.1:5500/setting.html')
            settings.on('close', () =>
            {
                settings_hasopen = false
                mainWin.loadFile('./index.html')
                settings = null
            })
        }
    })
    ipcMain.on('note', (event, data) => {
        var note = new BrowserWindow({
            width:600,
            height:600,
            resizable:false,
            webPreferences:{
                nodeIntegration:true,
                contextIsolation:false
            }
        })
        // note.webContents.openDevTools()
        Menu.setApplicationMenu(null)
        note.loadFile('./note.html')
        // note.loadURL('http://127.0.0.1:5500/note.html')
        note.on('close', () => {
            note = null
        })
    })
    ipcMain.on('note-editor', (event, data) => {
        var editor = new BrowserWindow({
            width:600,
            height:600,
            resizable:false,
            webPreferences:{
                nodeIntegration:true,
                contextIsolation:false
            }
        })
        // editor.webContents.openDevTools()
        Menu.setApplicationMenu(null)
        editor.loadFile('./windows/note/editor.html')
        // editor.loadURL('http://127.0.0.1:5500/windows/note/editor.html')
        editor.on('close', () => {
            editor = null
        })
    })
    mainWin.loadFile('./index.html')
    // mainWin.loadURL('http://127.0.0.1:5500/index.html')
    mainWin.on('close', () =>
    {
        mainWin = null
    })
})
