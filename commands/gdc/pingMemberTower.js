const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_ping_user_gdc")
        .setDescription("Ping an user by their ID"),

    async execute(interaction) {
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            try {
                // Définir les positions à rechercher
                const positions = ['H', 'M', 'B'];

                // Différer la réponse initiale à l'interaction
                await interaction.deferReply();

                // Parcourir chaque position
                for (const position of positions) {
                    // Récupérer les utilisateurs pour la position actuelle
                    const usersInPosition = await Users.findAll({
                        where: { positionTour: position }
                    });
                    let positionString = ""
                    if (position == "H") {
                        positionString = "Tour du Haut"
                    }
                    if (position == "M") {
                        positionString = "Tour du Millieu"
                    }
                    if (position == "B") {
                        positionString = "Tour du Bas"
                    }
                    // Créer un message avec les utilisateurs pour la position actuelle
                    let message = `Position ${positionString}:\n`;
                    message += usersInPosition.map(user => `<@${user.dataValues.userId}>`).join(' ');

                    // Envoyer le message
                    await interaction.followUp(message);
                }
            } catch (error) {
                console.error("An error occurred while executing the admin_ping_user_gdc command:", error);
                return interaction.reply("An error occurred while executing the command. Please try again later.");
            }
        } else {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }
    }
};
