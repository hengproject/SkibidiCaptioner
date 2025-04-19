import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {spawn} from 'node:child_process'

const { app, BrowserWindow } = await import('electron')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isPackaged = app.isPackaged

function launchFlaskBackend() {

    let pyProcess

    if (isPackaged) {
        const exePath = path.join(process.resourcesPath, 'server.exe')
        pyProcess = spawn(exePath)
    } else {
        pyProcess = spawn('./backend/.venv/Scripts/python.exe', ['./backend/server.py'])
    }

    pyProcess.stdout.on('data', (data) => {
        console.log(`[Flask stdout]: ${data}`)
    })

    pyProcess.stderr.on('data', (data) => {
        console.error(`[Flask stderr]: ${data}`)
    })

    pyProcess.on('error', (err) => {
        console.error('❌ Failed to start Flask server:', err)
    })
}
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        frame: true,
        // titleBarStyle: 'hidden',
        fullscreen: false,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            webSecurity: false
        }
    })
    win.webContents.openDevTools()
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
}

app.whenReady().then(() => {
    launchFlaskBackend()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

