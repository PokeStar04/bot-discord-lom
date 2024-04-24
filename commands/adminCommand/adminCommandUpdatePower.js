const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");

// ID du serveur spécifique où vous souhaitez autoriser l'exécution de la commande
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_update_member_power")
        .setDescription("Commande réservée aux administrateurs")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription("Votre pseudo en Jeu")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('power')
                .setDescription("La nouvelle puissance")
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Vérifier si l'utilisateur qui a émis la commande est un administrateur
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            const pseudo = interaction.options.getString('pseudo');
            const newPower = interaction.options.getNumber('power');

            try {
                // Mettre à jour les données de l'utilisateur cible dans la base de données
                const affectedRows = await Users.update({ power: newPower }, { where: { pseudo: pseudo } });

                if (affectedRows > 0) {
                    return interaction.reply(`Les données de l'utilisateur ${pseudo} ont été mises à jour avec succès.`);
                } else {
                    return interaction.reply(`Aucun utilisateur trouvé avec l'username ${pseudo}.`);
                }
            } catch (error) {
                console.error("Une erreur s'est produite lors de la mise à jour des données de l'utilisateur:", error);
                return interaction.reply("Une erreur s'est produite lors de la mise à jour des données de l'utilisateur. Veuillez réessayer plus tard.");
            }
        } else {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }
    }
};
