const fs = require('fs');
const { exec } = require('child_process');

let lastModifiedTime;

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

function checkAndPushChanges() {
    const currentHour = new Date().getHours();

    // Vérifier si l'heure actuelle est entre 2h et 8h (non inclus)
    if (currentHour >= 2 && currentHour < 8) {
        console.log(`Il est ${formatDate()}, le script est en pause jusqu'à 8h.`);
        return;
    }
    // Sinon, vérifier si l'heure actuelle est entre 8h et 2h (non inclus)
    else if (currentHour >= 8 || currentHour < 2) {
        fs.stat('database.sqlite', (err, stats) => {
            if (err) {
                console.error('Erreur lors de la lecture des informations sur le fichier :', err);
                return;
            }

            const currentModifiedTime = stats.mtime;

            if (!lastModifiedTime || currentModifiedTime > lastModifiedTime) {
                console.log('Des modifications ont été détectées. Envoi des modifications vers GitHub...');

                const commitMessage = `Mise à jour de la base de données (${formatDate()})`;

                exec('git add database.sqlite', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erreur lors de l'ajout de la base de données : ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Erreur lors de l'ajout de la base de données : ${stderr}`);
                        return;
                    }

                    exec(`git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Erreur lors du commit de la base de données : ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`Erreur lors du commit de la base de données : ${stderr}`);
                            return;
                        }

                        exec('git push', (error, stdout, stderr) => {
                            // if (error) {
                            //     console.error(`Erreur lors de la poussée de la base de données : ${error.message}`);
                            //     return;
                            // }
                            // if (stderr) {
                            //     console.error(`Erreur lors de la poussée de la base de données : ${stderr}`);
                            //     return;
                            // }
                            console.log(`Modifications envoyées avec succès vers GitHub ${formatDate()}`);
                        });
                    });
                });

                lastModifiedTime = currentModifiedTime;
            } else {
                //console.log('Aucune modification détectée dans la base de données.');
            }
        });
    }
}

// Vérifiez les modifications toutes les heures
setInterval(checkAndPushChanges, 3600000); // 3600000 ms = 1 heure
