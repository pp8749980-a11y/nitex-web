import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Servir archivos estáticos (imágenes, js, css)
app.use(express.static(browserDistFolder, {
  maxAge: '1y'
}));

// Enviar el index.html para cualquier ruta (Modo SPA)
app.get('**', (req, res) => {
  res.sendFile(resolve(browserDistFolder, 'index.html'));
});

const port = process.env['PORT'] || 10000;
app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Servidor de Nitex funcionando en puerto ${port}`);
});
