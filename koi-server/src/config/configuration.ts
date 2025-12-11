import fs from 'node:fs';
import { join } from 'node:path';
import * as os from 'node:os';
import { homedir } from 'node:os';

function checkDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
export default () => {
  let configFile = '';
  if (process.env.configPath) {
    configFile = process.env.configPath;
  } else {
    if (os.platform() === 'win32') {
      configFile = join(
        homedir(),
        'AppData',
        'Roaming',
        'Electron',
        'koi-electron.json',
      );
    } else if (os.platform() === 'linux') {
      configFile = join(homedir(), '.config', 'Electron', 'koi-electron.json');
    } else {
      configFile = join(
        homedir(),
        'Library',
        'Application Support',
        'Electron',
        'koi-electron.json',
      );
    }
  }
  if (!fs.existsSync(configFile)) {
    return {};
  }
  const jsonData = fs.readFileSync(configFile, 'utf8');
  const { storage = '', backup = '' } =
    (JSON.parse(jsonData) as { storage: string; backup: string }) || {};
  const rootPath = join(storage, 'uploads');
  checkDirExists(storage);
  checkDirExists(backup);
  checkDirExists(rootPath);
  return {
    storage,
    backup,
    rootPath,
  };
};
