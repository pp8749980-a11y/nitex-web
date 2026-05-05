const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 10000;
const distPath = path.join(__dirname, 'dist/app/browser');

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor estático corriendo en puerto ${port}`);
});
