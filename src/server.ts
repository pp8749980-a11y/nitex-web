import {
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

/**
 * Servir archivos estáticos del navegador
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }),
);

/**
 * Manejador de Angular SSR
 */
const reqHandler = createNodeRequestHandler(app);

app.get('**', (req, res, next) => {
  reqHandler(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

/**
 * Iniciar el servidor
 */
const port = process.env['PORT'] || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Node Express server listening on http://0.0.0.0:${port}`);
});
