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

// Endpoint pour mettre à jour les utilisateurs
app.put('/users', async (req, res) => {
    const updatedUsers = req.body; // Les utilisateurs mis à jour envoyés depuis votre site internet

    try {
        // Boucle sur chaque utilisateur mis à jour
        for (const updatedUser of updatedUsers) {
            const userId = updatedUser.userId;

            // Vérifier quels champs sont présents dans l'objet utilisateur mis à jour
            const { pseudo, power, positionTour } = updatedUser;
            const updateData = {};
            if (pseudo !== undefined) updateData.pseudo = pseudo;
            if (power !== undefined) updateData.power = power;
            if (positionTour !== undefined) updateData.positionTour = positionTour;

            // Effectuer les mises à jour dans la base de données pour chaque utilisateur
            const user = await User.findByPk(userId);
            if (user) {
                await user.update(updateData);
            }
        }

        res.status(200).json({ message: 'Users updated successfully' });
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
