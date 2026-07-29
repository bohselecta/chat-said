import { spawn, spawnSync } from 'node:child_process';
import os from 'node:os';

function exists(command) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(checker, [command], { stdio: 'ignore' }).status === 0;
}

export function startDiscovery(port, { quiet = false } = {}) {
  const name = `ChatSaid Taurus on ${os.hostname()}`;
  let child = null;
  if (process.platform === 'linux' && exists('avahi-publish-service')) {
    child = spawn('avahi-publish-service', [name, '_chatsaid-taurus._tcp', String(port), 'path=/', 'version=0.1.0'], { stdio: quiet ? 'ignore' : 'inherit' });
  } else if ((process.platform === 'darwin' || process.platform === 'win32') && exists('dns-sd')) {
    child = spawn('dns-sd', ['-R', name, '_chatsaid-taurus._tcp', 'local.', String(port), 'path=/', 'version=0.1.0'], { stdio: quiet ? 'ignore' : 'inherit' });
  }
  return {
    advertised: Boolean(child),
    hostname: `${os.hostname()}.local`,
    stop() {
      if (child && !child.killed) child.kill('SIGTERM');
    },
  };
}
