const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const PACKAGE_NAME = 'com.mtimer.app';
const DEFAULT_APK = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk'
);

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function findAdb() {
  const candidates = [];

  if (process.env.ANDROID_HOME) {
    candidates.push(path.join(process.env.ANDROID_HOME, 'platform-tools', 'adb.exe'));
    candidates.push(path.join(process.env.ANDROID_HOME, 'platform-tools', 'adb'));
  }

  if (process.env.ANDROID_SDK_ROOT) {
    candidates.push(path.join(process.env.ANDROID_SDK_ROOT, 'platform-tools', 'adb.exe'));
    candidates.push(path.join(process.env.ANDROID_SDK_ROOT, 'platform-tools', 'adb'));
  }

  if (process.env.LOCALAPPDATA) {
    candidates.push(path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return 'adb';
}

function run(adb, args, options = {}) {
  return execFileSync(adb, args, {
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });
}

function getDevice(adb) {
  const output = run(adb, ['devices']);
  const devices = output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, status] = line.split(/\s+/);
      return { id, status };
    });

  const ready = devices.find((device) => device.status === 'device');
  if (ready) return ready.id;

  if (devices.length > 0) {
    throw new Error(`Nenhum device autorizado. Estado encontrado: ${JSON.stringify(devices)}`);
  }

  throw new Error('Nenhum celular/emulador conectado no adb.');
}

function main() {
  const apkPath = path.resolve(process.argv[2] || DEFAULT_APK);
  if (!fs.existsSync(apkPath)) {
    throw new Error(`APK nao encontrado: ${apkPath}`);
  }

  const adb = findAdb();
  const deviceId = getDevice(adb);
  const deviceArgs = ['-s', deviceId];

  console.log(`Device: ${deviceId}`);
  console.log(`Instalando: ${apkPath}`);
  run(adb, [...deviceArgs, 'install', '-r', apkPath], { stdio: 'inherit' });

  run(adb, [...deviceArgs, 'shell', 'am', 'force-stop', PACKAGE_NAME]);
  run(adb, [...deviceArgs, 'logcat', '-c']);

  console.log('Abrindo app...');
  run(adb, [
    ...deviceArgs,
    'shell',
    'monkey',
    '-p',
    PACKAGE_NAME,
    '-c',
    'android.intent.category.LAUNCHER',
    '1',
  ]);

  sleep(7000);

  const pidResult = spawnSync(adb, [...deviceArgs, 'shell', 'pidof', PACKAGE_NAME], {
    encoding: 'utf8',
  });
  const pid = (pidResult.stdout || '').trim();

  const logcat = run(adb, [...deviceArgs, 'logcat', '-d', '-t', '800']);
  const appCrashed =
    /FATAL EXCEPTION|ReactNativeJS.*ReferenceError|ReactNativeJS.*TypeError|Unable to start activity|Process: com\.mtimer\.app/.test(logcat) &&
    logcat.includes(PACKAGE_NAME);

  if (!pid || appCrashed) {
    const crashLines = logcat
      .split(/\r?\n/)
      .filter((line) =>
        /FATAL EXCEPTION|ReactNativeJS|Unable to start activity|Process: com\.mtimer\.app|com\.mtimer\.app/.test(line)
      )
      .slice(-80)
      .join('\n');

    throw new Error(`O app nao permaneceu aberto ou gerou crash.\n${crashLines}`);
  }

  console.log(`OK: app aberto e processo ativo (${PACKAGE_NAME}, pid ${pid}).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
