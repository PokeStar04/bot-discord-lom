const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_gdc_status_tower")
        .setDescription("Affiche tous les utilisateurs qui ne sont pas dans une position de tour"),

    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        try {
            // Récupérer tous les utilisateurs dont la position de tour n'est pas 'H', 'M' ou 'B'
            const usersWithoutPosition = await Users.findAll({
                where: {
                    positionTour: {
                        $not: ['H', 'M', 'B']
                    }
                }
            });

            // Construire le message avec les utilisateurs sans position de tour
            let message = "Utilisateurs sans position de tour :\n";
            for (const user of usersWithoutPosition) {
                message += `Nom: ${user.pseudo}\n`;
            }

            // Envoyer le message contenant les utilisateurs sans position de tour
            await interaction.reply(message);
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'exécution de la commande show_users_without_position:", error);
            return interaction.reply("Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer plus tard.");
        }
    }
};
