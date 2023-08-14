const express = require('express');
const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Une route API de test
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
   console.log(`Serveur lancé sur http://localhost:${port}`);
});