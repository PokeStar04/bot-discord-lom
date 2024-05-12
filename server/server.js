const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');

const app = express();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const User = require('../models/users')(sequelize, Sequelize);

app.use(cors());
app.use(express.json()); // Middleware pour parser le corps des requêtes en tant qu'objet JSON

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/updateUsers', async (req, res) => {
    const updatedUsers = req.body; // Utilisateurs mis à jour envoyés depuis votre site internet

    try {
        // Vérifiez que les données envoyées sont sous forme de tableau
        if (!Array.isArray(updatedUsers)) {
            throw new Error('Invalid format: expected an array of objects');
        }

        // Boucle sur chaque utilisateur mis à jour
        for (const updatedUser of updatedUsers) {
            const userId = updatedUser.userId;

            // Créez un objet pour stocker les données de mise à jour
            const updateData = {};

            // Vérifiez quels champs sont présents dans l'objet utilisateur mis à jour
            if (updatedUser.ordreTour !== undefined) updateData.ordreTour = updatedUser.ordreTour;
            if (updatedUser.power !== undefined) updateData.power = updatedUser.power;
            if (updatedUser.positionTour !== undefined) updateData.positionTour = updatedUser.positionTour;

            // Effectuer les mises à jour dans la base de données pour chaque utilisateur
            const user = await User.findByPk(userId);
            if (user) {
                await user.update(updateData);
            } else {
                console.error(`User with ID ${userId} not found`);
            }
        }

        res.status(200).json({ message: 'Users updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://51.254.96.184:${port}`);
});
