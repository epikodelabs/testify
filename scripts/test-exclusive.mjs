import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(ROOT, '.test-exclusive-tmp');

// ─── Helpers ───────────────────────────────────────────────────────────────

function cleanup() {
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
}

async function killPortOccupier(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (err || !stdout) { resolve(); return; }
      const pids = new Set();
      for (const line of stdout.trim().split('\n')) {
        const m = line.trim().match(/(\d+)\s*$/);
        if (m) pids.add(m[1]);
      }
      for (const pid of pids) {
        try { process.kill(parseInt(pid, 10)); } catch {}
      }
      setTimeout(resolve, 500);
    });
  });
}

function waitForOutput(proc, pattern, timeoutMs) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => reject(new Error('Timeout waiting for: ' + pattern)), timeoutMs);

    const onData = (data) => {
      buffer += data.toString();
      if (buffer.includes(pattern)) {
        clearTimeout(timer);
        proc.stdout.off('data', onData);
        proc.stderr.off('data', onData);
        resolve(buffer);
      }
    };

    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
  });
}

// ─── Clean up any previous runs ────────────────────────────────────────────

await killPortOccupier(8888);
cleanup();

// ─── Setup minimal testify project ─────────────────────────────────────────

fs.mkdirSync(path.join(TMP, 'src'), { recursive: true });
fs.mkdirSync(path.join(TMP, 'tests'), { recursive: true });

fs.writeFileSync(path.join(TMP, 'testify.json'), JSON.stringify({
  srcDirs: ['./src'],
  testDirs: ['./tests'],
  port: 8888
}, null, 2));

fs.writeFileSync(path.join(TMP, 'src/dummy.js'), 'export const x = 1;');
fs.writeFileSync(path.join(TMP, 'tests/dummy.spec.js'), `
describe('dummy', () => {
  it('passes', () => expect(true).toBe(true));
});
`);

// ─── Step 1: Start first testify instance (NO --exclusive) ─────────────────

const testify1 = spawn('node', [path.join(ROOT, 'dist/testify/bin/testify'), '--watch'], {
  cwd: TMP,
  stdio: 'pipe'
});

let testify1Pid = testify1.pid;
console.log('🟡 Testify #1 started, PID:', testify1Pid);

try {
  await waitForOutput(testify1, '🚀 Test server running at http://localhost:8888', 15000);
  console.log('🟢 Testify #1 is serving on port 8888');
} catch (err) {
  console.error('❌ FAIL: Testify #1 never started server:', err.message);
  testify1.kill();
  cleanup();
  process.exit(1);
}

// ─── Step 2: Start second testify instance (WITH --exclusive) ──────────────

const pidFile = path.join(TMP, '.testify-8888.pid');
const pidExists = fs.existsSync(pidFile);
const pidContent = pidExists ? fs.readFileSync(pidFile, 'utf-8').trim() : 'N/A';
console.log(`🔍 PID file check: exists=${pidExists}, content=${pidContent}`);

const testify2 = spawn('node', [path.join(ROOT, 'dist/testify/bin/testify'), '--exclusive', '--watch'], {
  cwd: TMP,
  stdio: 'pipe'
});

let testify2Pid = testify2.pid;
console.log('🟡 Testify #2 started (with --exclusive), PID:', testify2Pid);

let testify2Output = '';
testify2.stdout.on('data', d => { testify2Output += d; });
testify2.stderr.on('data', d => { testify2Output += d; });

// Wait for #2 to start its server
try {
  await waitForOutput(testify2, '🚀 Test server running at http://localhost:8888', 15000);
  console.log('🟢 Testify #2 is serving on port 8888');
} catch (err) {
  console.error('❌ FAIL: Testify #2 never started server:', err.message);
  console.error('Testify #2 output:\n', testify2Output);
  testify1.kill();
  testify2.kill();
  cleanup();
  process.exit(1);
}

// Give a moment for the kill to propagate
await new Promise(r => setTimeout(r, 1000));

// ─── Step 3: Verify results ────────────────────────────────────────────────

let testify1Alive = false;
try { process.kill(testify1Pid, 0); testify1Alive = true; } catch {}

let testify2Alive = false;
try { process.kill(testify2Pid, 0); testify2Alive = true; } catch {}

testify1.kill();
testify2.kill();

if (testify1Alive) {
  console.error('❌ FAIL: Testify #1 (without --exclusive) is still alive');
  console.error('Testify #2 output:\n', testify2Output);
  cleanup();
  process.exit(1);
}

if (!testify2Alive) {
  console.error('❌ FAIL: Testify #2 (with --exclusive) is not running');
  console.error('Testify #2 output:\n', testify2Output);
  cleanup();
  process.exit(1);
}

if (!testify2Output.includes('🔒 Terminated previous testify instance (PID ' + testify1Pid + ')')) {
  console.error('❌ FAIL: Expected kill log for PID ' + testify1Pid + ' not found');
  console.error('Testify #2 output:\n', testify2Output);
  cleanup();
  process.exit(1);
}

console.log('✅ PASS: Testify #1 was killed, Testify #2 is running with --exclusive');
console.log('Testify #2 output:\n', testify2Output.slice(-600));
cleanup();
process.exit(0);
