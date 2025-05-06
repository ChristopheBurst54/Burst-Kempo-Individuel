const express = require('express');
const app = express();

// Middleware de base (optionnel)
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur Express en marche');
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
