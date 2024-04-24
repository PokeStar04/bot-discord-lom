// const { SlashCommandBuilder } = require("discord.js");
// const { client } = require('../../index');

// // Fonction pour envoyer le message aux serveurs spécifiés
// async function sendMessageToServers(messageContent, guildIds) {
//     try {
//         guildIds.forEach(async guildId => {
//             const guild = await client.guilds.fetch(guildId);
//             if (guild) {
//                 const systemChannel = guild.systemChannel;
//                 if (systemChannel) {
//                     systemChannel.send(messageContent)
//                         .then(() => console.log(`Message envoyé avec succès sur le serveur ${guild.name}`))
//                         .catch(error => console.error(`Impossible d'envoyer le message sur le serveur ${guild.name}:`, error));
//                 }
//             }
//         });
//     } catch (error) {
//         console.error("Une erreur s'est produite lors de l'envoi du message interserver:", error);
//     }
// }

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("interserver")
//         .setDescription("Envoyer un message à tous les serveurs spécifiés."),
//     async execute(interaction) {
//         const messageContent = "Ceci est un message envoyé à partir de la commande interserver !";
//         const guildIdsToMessage = ['1227242012390985738', '1227322579564626020']; // Guild IDs spécifiés

//         // Appeler la fonction pour envoyer le message aux serveurs spécifiés
//         await sendMessageToServers(messageContent, guildIdsToMessage);

//         // Répondre à l'utilisateur que le message a été envoyé
//         return interaction.reply("Message envoyé à tous les serveurs spécifiés !");
//     }
// };
