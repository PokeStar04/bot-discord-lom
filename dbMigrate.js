const { Montures, Users } = require("./dbObjects");
const { montureMigrations } = require("./migrations/migrationSeed01.json");
const clanData = require("./migrations/dataClan.json");

// Fonction pour migrer les données des montures
async function migrateMontureData() {
    try {
        for (const montureData of montureMigrations) {
            await Montures.create({
                tier: montureData.tier,
                nombreEtoile: montureData.nombreEtoile,
                nombreRessortToUp: montureData.nombreRessortToUp,
                cumulRessortToUp: montureData.cumulRessortToUp
            });
        }
        console.log('Données des montures insérées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données des montures :', error);
    }
}

// Fonction pour migrer les données du clan
async function migrateClanData() {
    try {
        for (const userData of clanData) {
            await Users.create({
                userId: userData.userId,
                username: userData.username,
                pseudo: userData.pseudo,
                power: userData.power,
                positionTour: userData.positionTour
            });
        }
        console.log('Données du clan insérées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données du clan :', error);
    }
}

// Appel des fonctions pour migrer les données
migrateMontureData();
migrateClanData();
