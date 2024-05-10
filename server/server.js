const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Créer une application Express
const app = express();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('database.sqlite');

// Endpoint pour récupérer les données de la table users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Port d'écoute de l'API
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
