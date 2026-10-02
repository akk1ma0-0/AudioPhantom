import { join } from 'node:path';
import { BrowserWindow, app } from 'electron';

// P0 skeleton. P1 adds the cursor overlay window, hotkeys and screen capture (docs/ROADMAP.md).
function createPanel(): BrowserWindow {
  const win = new BrowserWindow({
    width: 380,
    height: 520,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
    },
  });
  // Panel must stay out of screen shares (PLAN 7.4; verify per Windows version in P1).
  win.setContentProtection(true);

  if (process.env['ELECTRON_RENDERER_URL']) {
    void win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/panel/index.html`);
  } else {
    void win.loadFile(join(__dirname, '../renderer/panel/index.html'));
  }
  return win;
}

void app.whenReady().then(createPanel);
app.on('window-all-closed', () => app.quit());
