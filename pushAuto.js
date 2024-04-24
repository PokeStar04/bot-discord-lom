const { exec } = require('child_process');
const cron = require('node-cron');

// Fonction pour formater la date
function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Définissez la tâche planifiée toutes les 15 minutes
cron.schedule('*/15 * * * * *', () => {
    const commitMessage = `Mise à jour de la base de données. -(${formatDate()})`;
    // Exécutez la commande pour ajouter, commettre et pousser les modifications
    exec(`git add database.sqlite && git commit -m "${commitMessage}" && git push`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de la mise à jour de la base de données : ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erreur lors de la mise à jour de la base de données : ${stderr}`);
            return;
        }
        console.log('Base de données mise à jour avec succès');
    });
});
