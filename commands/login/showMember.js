// const { SlashCommandBuilder } = require("discord.js");
// const { Users } = require("../../dbObjects.js");
// const allowedGuildId = '1227242012390985738';

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("imperium")
//         .setDescription("Affiche la totalité du clan"),
//     async execute(interaction) {
//         if (interaction.guildId !== allowedGuildId) {
//             return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
//         }
//         try {
//             // Récupérer tous les utilisateurs de la base de données

//             const allUsers = await Users.findAll();

//             if (allUsers && allUsers.length > 0) {
//                 // Construire le message à afficher
//                 let message = "Voici la totalité du clan :\n";
//                 allUsers.forEach(user => {
//                     message += `Utilisateur: ${user.pseudo}, Puissance: ${user.power}\n`;
//                 });

//                 // Répondre avec le message contenant les informations des utilisateurs
//                 return interaction.reply({ content: message, ephemeral: true });
//             } else {
//                 // Si aucun utilisateur n'est trouvé dans la base de données
//                 return interaction.reply({ content: "Aucun utilisateur trouvé dans la base de données.", ephemeral: true });
//             }
//         } catch (error) {
//             console.error("Une erreur s'est produite lors de la récupération des utilisateurs:", error);
//             return interaction.reply("Une erreur s'est produite lors de la récupération des utilisateurs. Veuillez réessayer plus tard.");
//         }
//     }
// };


const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imperium")
        .setDescription("Affiche la totalité du clan"),
    async execute(interaction) {
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }
        try {
            // Récupérer tous les utilisateurs de la base de données
            const allUsers = await Users.findAll({ order: [['power', 'DESC']] }); // Tri par puissance décroissante

            if (allUsers && allUsers.length > 0) {
                // Construire le message à afficher
                let message = "Voici la totalité du clan :\n";
                allUsers.forEach(user => {
                    message += `Utilisateur: ${user.pseudo}, Puissance: ${user.power}\n`;
                });

                // Répondre avec le message contenant les informations des utilisateurs
                return interaction.reply({ content: message, ephemeral: true });
            } else {
                // Si aucun utilisateur n'est trouvé dans la base de données
                return interaction.reply({ content: "Aucun utilisateur trouvé dans la base de données.", ephemeral: true });
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des utilisateurs:", error);
            return interaction.reply("Une erreur s'est produite lors de la récupération des utilisateurs. Veuillez réessayer plus tard.");
        }
    }
};

