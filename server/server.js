const express = require('express');
const Sequelize = require('sequelize');

// Créer une application Express
const app = express();

// Connexion à la base de données SQLite avec Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Importer le modèle "users"
const User = require('../models/users')(sequelize, Sequelize);

// Endpoint pour récupérer les données de la table users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Port d'écoute de l'API
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://51.254.96.184:${port}`);

});
