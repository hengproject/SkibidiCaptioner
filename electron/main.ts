import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { app, BrowserWindow } from 'electron'
import kill from 'tree-kill'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isPackaged = app.isPackaged

let flaskProcess: ReturnType<typeof spawn> | null = null  // ✅ 提到全局

function launchFlaskBackend() {
    if (isPackaged) {
        const exePath = path.join(process.resourcesPath, 'server.exe')
        flaskProcess = spawn(exePath)
    } else {
        flaskProcess = spawn('./backend/.venv/Scripts/python.exe', ['./backend/server.py'])
    }

    flaskProcess.stdout.on('data', (data) => {
        console.log(`[Flask stdout]: ${data}`)
    })

    flaskProcess.stderr.on('data', (data) => {
        console.error(`[Flask stderr]: ${data}`)
    })

    flaskProcess.on('error', (err) => {
        console.error('❌ Failed to start Flask server:', err)
    })
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 330,
        frame: true,
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

// ✅ 关闭 Electron 时，杀掉 Flask 子进程
app.on('before-quit', () => {
    if (flaskProcess) {
        kill(flaskProcess.pid)
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
