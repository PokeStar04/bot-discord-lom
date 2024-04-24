// Import tables
const { Montures } = require("./dbObjects");
// Get the different migrations (Array of Objects)
// Should be a require from different migration files
const { montureMigrations } = require("./migrations/migrationSeed01.json");


for (currentMontureData = 0; currentMontureData < montureMigrations.length; currentMontureData++) {
    console.log(montureMigrations[currentMontureData]);
    addMontureData(montureMigrations[currentMontureData]);
}


async function addMontureData(currentMontureData) {
    try {
        await Montures.create({
            tier: currentMontureData.tier,
            nombreEtoile: currentMontureData.nombreEtoile,
            nombreRessortToUp: currentMontureData.nombreRessortToUp,
            cumulRessortToUp: currentMontureData.cumulRessortToUp
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            console.log("Entry already exists");
        }
        console.log(error);
    }
}
