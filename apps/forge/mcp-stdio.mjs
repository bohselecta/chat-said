import readline from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './lib/db.mjs';
import { handleMcpRequest } from './lib/mcp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(process.env.TAURUS_DATA_DIR || path.join(__dirname, '../..', 'data'));
const database = openDatabase(dataDir);
const ctx = {
  db: database.db,
  database,
  dataDir,
  config: { agentWrite: process.env.TAURUS_AGENT_WRITE === '1' },
};

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  try {
    const request = JSON.parse(line);
    const response = await handleMcpRequest(ctx, request);
    if (response != null) process.stdout.write(`${JSON.stringify(response)}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: error.message } })}\n`);
  }
}
database.close();
