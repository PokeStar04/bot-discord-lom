const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rename_member")
        .setDescription("Met à jour ton pseudo")
        .addStringOption(option =>
            option.setName('ancienpseudo')
                .setDescription('Votre ancien pseudo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nouveaupseudo')
                .setDescription('Votre nouveau pseudo')
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }
        // Vérifier si l'utilisateur qui exécute la commande est un administrateur
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }

        const ancienpseudo = interaction.options.getString('ancienpseudo');
        const nouveaupseudo = interaction.options.getString('nouveaupseudo');

        try {
            const user = await Users.update(
                { pseudo: nouveaupseudo },
                { where: { pseudo: ancienpseudo } }
            );

            if (user) {
                return interaction.reply(`Pseudo mis à jour avec succès.`);
            } else {
                return interaction.reply("L'ancien pseudo fourni n'existe pas dans la base de données.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour du pseudo:", error);
            return interaction.reply("Une erreur s'est produite lors de la mise à jour du pseudo. Veuillez réessayer plus tard.");
        }
    }
};
