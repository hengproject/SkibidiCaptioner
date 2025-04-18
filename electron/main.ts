import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {spawn} from 'node:child_process'

const { app, BrowserWindow } = await import('electron')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const py = spawn('python',['../backend/server.py'])

py.stdout.on('data', (data) => {
    console.log(`[flask] ${data}`)
})

py.stderr.on('data', (data) => {
    console.error(`[flask error] ${data}`)
})

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

    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
