import dgram from 'node:dgram';
import { normalizeMac } from './utils.mjs';

export async function sendWakeOnLan(mac, { address = '255.255.255.255', port = 9 } = {}) {
  const normalized = normalizeMac(mac);
  const bytes = Buffer.from(normalized.replaceAll(':', ''), 'hex');
  const packet = Buffer.concat([Buffer.alloc(6, 0xff), ...Array.from({ length: 16 }, () => bytes)]);
  return await new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');
    socket.once('error', (error) => { socket.close(); reject(error); });
    socket.bind(() => {
      socket.setBroadcast(true);
      socket.send(packet, Number(port), address, (error) => {
        socket.close();
        if (error) reject(error);
        else resolve({ mac: normalized, address, port: Number(port), bytes: packet.length });
      });
    });
  });
}
