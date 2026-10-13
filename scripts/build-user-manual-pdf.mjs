import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const markdownPath = path.join(rootDir, 'docs', 'MANUAL_DE_USUARIO.md');
const htmlOutputPath = path.join(rootDir, 'docs', 'manual-usuario-print.html');
const pdfOutputPath = path.join(rootDir, 'docs', 'MANUAL_DE_USUARIO.pdf');
const docsDir = path.join(rootDir, 'docs');
const logoPath = path.join(rootDir, 'apps', 'admin-web', 'public', 'logo-unisinu-rojo.png');
const escudoPath = path.join(rootDir, 'apps', 'admin-web', 'public', 'unisinu-escudo.png');

// 1. Convert markdown to HTML body using npx marked
const rawHtmlTemp = path.join(rootDir, 'docs', 'temp-user-body.html');
execSync(`npx -y marked -o "${rawHtmlTemp}" "${markdownPath}"`, { stdio: 'inherit' });
let bodyHtml = fs.readFileSync(rawHtmlTemp, 'utf-8');
fs.unlinkSync(rawHtmlTemp);

// 2. Read logos as base64
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  const buf = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
}

let escudoBase64 = '';
if (fs.existsSync(escudoPath)) {
  const buf = fs.readFileSync(escudoPath);
  escudoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
}

// 3. Inline all screenshots as base64
const screenshotNames = [
  'screenshot-login.png',
  'screenshot-dashboard.png',
  'screenshot-usuarios.png',
  'screenshot-rutas.png',
  'screenshot-encuestas.png',
  'screenshot-public-survey.png',
  'screenshot-resultados.png',
];

for (const name of screenshotNames) {
  const imgPath = path.join(docsDir, name);
  if (fs.existsSync(imgPath)) {
    const b64 = `data:image/png;base64,${fs.readFileSync(imgPath).toString('base64')}`;
    const regex = new RegExp(`src="${name}"`, 'g');
    bodyHtml = bodyHtml.replace(regex, `src="${b64}" class="app-screenshot"`);
  }
}

// 4. Build complete styled HTML document with academic print CSS
const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Manual de Usuario - Encuestas de Movilidad | Unisinú Cartagena</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Roboto:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @page {
      size: letter;
      margin: 18mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* Portada Institucional */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 92vh;
      padding: 40px 20px 20px 20px;
      text-align: center;
    }

    .cover-header {
      border-bottom: 3px solid #e42313;
      padding-bottom: 25px;
    }

    .cover-logo {
      max-height: 85px;
      max-width: 320px;
      margin: 0 auto 15px auto;
      object-fit: contain;
    }

    .cover-univ {
      font-family: 'Montserrat', sans-serif;
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 5px 0;
    }

    .cover-sub-univ {
      font-family: 'Montserrat', sans-serif;
      font-size: 11pt;
      font-weight: 600;
      color: #e42313;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
    }

    .cover-body {
      margin: 50px 0;
    }

    .cover-badge {
      display: inline-block;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #e42313;
      font-family: 'Montserrat', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 16px;
      border-radius: 9999px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .cover-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin: 0 0 15px 0;
    }

    .cover-subtitle {
      font-family: 'Montserrat', sans-serif;
      font-size: 13pt;
      font-weight: 600;
      color: #475569;
      margin: 0 0 25px 0;
    }

    .cover-escudo {
      max-height: 90px;
      margin: 20px auto;
      display: block;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      font-size: 9.5pt;
      color: #475569;
      line-height: 1.6;
    }

    .cover-footer strong {
      color: #0f172a;
    }

    /* Tipografía y Encabezados */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
      color: #0f172a;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      line-height: 1.3;
      page-break-after: avoid;
    }

    h1 {
      font-size: 17pt;
      font-weight: 800;
      color: #e42313;
      border-bottom: 2px solid #e42313;
      padding-bottom: 6px;
      page-break-before: always;
    }

    .cover-page + h1 {
      page-break-before: avoid;
    }

    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }

    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #334155;
    }

    p {
      margin: 0.6em 0;
      text-align: justify;
    }

    strong {
      color: #0f172a;
    }

    /* Tablas Institucionales */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 9pt;
      line-height: 1.4;
      page-break-inside: avoid;
    }

    th {
      background-color: #e42313 !important;
      color: #ffffff !important;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      border: 1px solid #c81e10;
      text-align: left;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Capturas de pantalla de la aplicación */
    .app-screenshot, img {
      max-width: 95%;
      height: auto;
      display: block;
      margin: 16px auto;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
      page-break-inside: avoid;
    }

    /* Citas y Callouts */
    blockquote {
      margin: 14px 0;
      padding: 10px 16px;
      border-left: 4px solid #e42313;
      background-color: #fef2f2;
      color: #7f1d1d;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    ul, ol {
      margin: 0.5em 0 0.8em 20px;
      padding: 0;
    }

    li {
      margin-bottom: 4px;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #c81e10;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 25px 0;
    }

    .content-wrapper {
      max-width: 100%;
    }
  </style>
</head>
<body>

  <!-- Portada Oficial de la Universidad del Sinú -->
  <div class="cover-page">
    <div class="cover-header">
      ${logoBase64 ? `<img src="${logoBase64}" alt="Universidad del Sinú" class="cover-logo" />` : ''}
      <div class="cover-univ">Universidad del Sinú Elías Bechara Zainúm</div>
      <div class="cover-sub-univ">Seccional Cartagena · Escuela de Ingeniería de Sistemas</div>
    </div>

    <div class="cover-body">
      <div class="cover-badge">Guía Oficial de Usuario · Versión 1.0</div>
      <h1 class="cover-title" style="page-break-before: avoid; border: none; padding: 0;">MANUAL DE USUARIO</h1>
      <div class="cover-subtitle">SISTEMA WEB DE GESTIÓN Y EVALUACIÓN DE ENCUESTAS DE RUTAS Y TRANSPORTE UNIVERSITARIO</div>
      ${escudoBase64 ? `<img src="${escudoBase64}" alt="Escudo Universidad del Sinú" class="cover-escudo" />` : ''}
      <p style="text-align: center; color: #64748b; font-size: 9pt; max-width: 520px; margin: 10px auto;">
        Guía paso a paso ilustrada con capturas reales para la administración de rutas, diseño de encuestas, diligenciamiento estudiantil y análisis de resultados.
      </p>
    </div>

    <div class="cover-footer">
      <strong>Institución:</strong> Universidad del Sinú Seccional Cartagena<br />
      <strong>Dependencia:</strong> Escuela de Ingeniería de Sistemas / Dirección Administrativa de Movilidad y Bienestar<br />
      <strong>Público Objetivo:</strong> Administradores, Operadores de Transporte y Estudiantes<br />
      <strong>Lugar y Fecha:</strong> Cartagena de Indias, D. T. y C., Colombia – Octubre de 2026
    </div>
  </div>

  <!-- Contenido del Manual de Usuario -->
  <div class="content-wrapper">
    ${bodyHtml}
  </div>

</body>
</html>`;

fs.writeFileSync(htmlOutputPath, fullHtml, 'utf-8');
console.log('HTML print template created at:', htmlOutputPath);

// 5. Generate PDF using Google Chrome headless
const chromeBinary = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
console.log('Rendering PDF via Google Chrome headless...');
execSync(
  `"${chromeBinary}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=2000 --print-to-pdf="${pdfOutputPath}" --no-pdf-header-footer "file://${htmlOutputPath}"`,
  { stdio: 'inherit' }
);

if (fs.existsSync(pdfOutputPath)) {
  const stats = fs.statSync(pdfOutputPath);
  console.log(`User Manual PDF successfully generated: ${pdfOutputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
} else {
  console.error('Failed to generate PDF.');
  process.exit(1);
}
