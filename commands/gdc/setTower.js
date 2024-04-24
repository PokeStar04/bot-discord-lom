const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_gdc_set_tower")
        .setDescription("Commande réservée aux administrateurs")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription("Le pseudo du joueur IG")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tour')
                .setDescription("Indiquez dans quel tour il doit aller 'H' ou 'M' ou 'B' ")
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Vérifier si l'utilisateur qui a émis la commande est un administrateur
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            const pseudo = interaction.options.getString('pseudo');
            const tour = interaction.options.getString('tour');
            let positionString = ""
            if (tour == "H") {
                positionString = "Haut"
            }
            if (tour == "M") {
                positionString = "Millieu"
            }
            if (tour == "B") {
                positionString = "Bas"
            }
            try {
                // Mettre à jour les données de l'utilisateur cible dans la base de données
                const affectedRows = await Users.update({ positionTour: tour }, { where: { pseudo: pseudo } });

                if (affectedRows > 0) {
                    return interaction.reply(`La Tour de ${pseudo} est désormais ${positionString} .`);
                } else {
                    return interaction.reply(`Aucun utilisateur trouvé avec l'pseudo ${pseudo}.`);
                }
            } catch (error) {
                console.error(`Une erreur s'est produite lors de la mise à jour des données de l'utilisateur: ${pseudo}`, error);
                return interaction.reply(`Une erreur s'est produite lors de la mise à jour des données de l'utilisateur ${pseudo}. Veuillez réessayer plus tard.`);
            }
        } else {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }
    }
};
