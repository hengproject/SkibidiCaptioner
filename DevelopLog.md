安装frontend: Vite + React + TailwindCSS@4
```shell
cd frontend
npm create vite@latest . -- --template react-ts
npm install
# install tailwind
npm install tailwindcss @tailwindcss/vite
```

安装electron:
```shell
npm install --save-dev electron
npm install --save-dev typescript tsx
mkdir electron
touch electron/main.ts
```
在main.ts中写入
```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⛔ 不要解构！Electron 的模块结构在 ESM 下会变
const electron = await import('electron')
console.log('electron import result:', electron)
// ✅ 使用 electron.app 而不是解构
const app = electron.app
const BrowserWindow = electron.BrowserWindow

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        frame: false,
        titleBarStyle: 'hidden',
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


```

安装 concurrently wait-on
```shell
npm install --save-dev concurrently wait-on
```
要修改一下根目录里的package.json,应为用的是ts。最终look like:
```json
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "electron/main.ts",
  "scripts": {
    "start": "tsx electron/main.ts",
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run electron:dev\"",
    "electron:dev": "wait-on http://localhost:5173 && electron ."
  },
  "type": "module",
  "devDependencies": {
    "concurrently": "^9.1.2",
    "electron": "^35.1.5",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3",
    "wait-on": "^8.0.3"
  }
}
```