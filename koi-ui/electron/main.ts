import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
  type BrowserWindowConstructorOptions,
} from 'electron';
import Store from 'electron-store';
import { fork } from 'child_process';
import { join } from 'node:path';
import { homedir } from 'node:os';
import process from 'node:process';
app.commandLine.appendSwitch('remote-allow-origins', '*');
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
const __IS_DEV__ = process.env.NODE_ENV === 'development';
Store.initRenderer();

interface IStore {
  storage: string | null;
  backup: string | null;
  init: boolean;
}

const store = new Store<IStore>({
  name: 'koi-electron',
  defaults: {
    init: false,
    storage: join(homedir(), 'koi-electron', 'storage'),
    backup: join(homedir(), 'koi-electron', 'backup'),
  },
});
async function handleDirectoryOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (!canceled) {
    return filePaths[0];
  }
}
let mainWindow: BrowserWindow;
const createWindow = async () => {
  const config: BrowserWindowConstructorOptions = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.maximize();
  const storage = store.get<string>('storage');
  if (process.env['ELECTRON_RENDERER_URL']) {
    if (storage) {
      await mainWindow
        .loadURL(process.env['ELECTRON_RENDERER_URL'])
        .then(() => {
          // mainWindow.webContents.openDevTools({ mode: 'bottom' });
        });
    } else {
      await mainWindow
        .loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/setting')
        .then(() => {
          // mainWindow.webContents.openDevTools({ mode: 'bottom' });
        });
    }
  } else {
    if (storage) {
      await mainWindow.loadFile(app.getAppPath() + '/koi-ui/dist/index.html');
    } else {
      await mainWindow.loadFile(app.getAppPath() + '/koi-ui/dist/index.html', {
        hash: '/setting',
      });
    }
  }
};

const gotTheLock = app.requestSingleInstanceLock();
const controller = new AbortController();
ipcMain.handle('selectFolder', () => {
  return dialog.showOpenDialogSync(mainWindow, {
    title: '请选择存储目录',
    properties: ['createDirectory', 'openDirectory'],
  });
});
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });
  app.whenReady().then(async () => {
    ipcMain.handle('dialog:openDirectory', handleDirectoryOpen);
    createWindow();
    globalShortcut.register('CommandOrControl+Shift+E', () => {
      store.openInEditor();
    });
    globalShortcut.register('CommandOrControl+Shift+T', () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools({ mode: 'bottom' });
      }
    });

    if (!__IS_DEV__) {
      const configPath = store.path;
      const { signal } = controller;
      const koiServer = fork(
        join(app.getAppPath(), 'koi-server', 'dist', 'main.js'),
        {
          signal,
          env: {
            NODE_ENV: 'production',
            configPath,
          },
        },
      );
      koiServer.once('error', (err) => {
        console.log(err);
      });
    }
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      app.exit();
    }
  });
  app.on('quit', () => {
    globalShortcut.unregisterAll();
    if (!__IS_DEV__) {
      controller.abort();
    }
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      app.exit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}
