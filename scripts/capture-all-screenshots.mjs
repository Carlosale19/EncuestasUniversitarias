import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const docsDir = path.join(rootDir, 'docs');

async function getAuthToken() {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@universidad.edu', password: 'Admin12345' }),
  });
  const data = await res.json();
  return { token: data.accessToken, user: data.user };
}

function cdpSend(ws, method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function captureRoute(ws, route, filename, token, user) {
  console.log(`Capturing ${route} -> ${filename}...`);
  let msgId = 10;

  // Set window viewport
  await cdpSend(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1.5,
    mobile: false,
  }, msgId++);

  // Navigate to blank
  await cdpSend(ws, 'Page.navigate', { url: 'http://localhost:5173/' }, msgId++);
  await new Promise((r) => setTimeout(r, 600));

  // If authenticated route, inject auth store
  if (token && user && !route.startsWith('/iniciar') && !route.startsWith('/encuesta')) {
    const authState = JSON.stringify({
      state: { token, user },
      version: 0,
    });
    await cdpSend(ws, 'Runtime.evaluate', {
      expression: `localStorage.setItem('encuestas-auth', ${JSON.stringify(authState)});`,
    }, msgId++);
  }

  // Navigate to target route
  await cdpSend(ws, 'Page.navigate', { url: `http://localhost:5173${route}` }, msgId++);
  await new Promise((r) => setTimeout(r, 1500));

  // Capture screenshot
  const result = await cdpSend(ws, 'Page.captureScreenshot', { format: 'png' }, msgId++);
  const outPath = path.join(docsDir, filename);
  fs.writeFileSync(outPath, Buffer.from(result.data, 'base64'));
  console.log(`Saved: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('Logging in to get JWT token...');
  const { token, user } = await getAuthToken();

  const newTargetRes = await fetch('http://localhost:9222/json/new?about:blank', { method: 'PUT' });
  const target = await newTargetRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.onopen = resolve);
  console.log('Connected to CDP target:', target.id);

  // Enable Page and Runtime domains
  await cdpSend(ws, 'Page.enable', {}, 1);
  await cdpSend(ws, 'Runtime.enable', {}, 2);

  try {
    await captureRoute(ws, '/iniciar-sesion', 'screenshot-login.png', token, user);
    await captureRoute(ws, '/dashboard', 'screenshot-dashboard.png', token, user);
    await captureRoute(ws, '/usuarios', 'screenshot-usuarios.png', token, user);
    await captureRoute(ws, '/rutas', 'screenshot-rutas.png', token, user);
    await captureRoute(ws, '/encuestas', 'screenshot-encuestas.png', token, user);
    await captureRoute(ws, '/resultados', 'screenshot-resultados.png', token, user);
    await captureRoute(
      ws,
      '/encuesta/encuesta-de-satisfaccion-ruta-norte-21e40b60',
      'screenshot-public-survey.png',
      null,
      null
    );
    console.log('All screenshots captured successfully!');
  } finally {
    ws.close();
    await fetch('http://localhost:9222/json/close/' + target.id);
  }
}

main().catch(console.error);
