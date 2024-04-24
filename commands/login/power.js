const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");

// ID du serveur spécifique où vous souhaitez autoriser l'exécution de la commande
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("power")
        .setDescription("Met à jour ta puissance")
        .addStringOption(option =>
            option.setName('power')
                .setDescription('Ta puissance')
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        const newPower = interaction.options.getString('power');
        const userId = interaction.user.id;

        try {
            // Recherche de l'utilisateur dans la base de données
            const user = await Users.findOne({ where: { userId: userId } });

            if (user) {
                // Mise à jour de la puissance de l'utilisateur
                await user.update({ power: newPower });
                await interaction.reply({ content: `Puissance de l'utilisateur ${user.pseudo} mise à jour avec succès.`, ephemeral: true });
            } else {
                // Si l'utilisateur n'existe pas dans la base de données
                await interaction.reply({ content: `Vous n'êtes pas enregistré. Veuillez utiliser la commande '/login' d'abord.`, ephemeral: true });
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour de la puissance de l'utilisateur:", error);
            await interaction.reply({ content: `Une erreur s'est produite lors de la mise à jour de la puissance de l'utilisateur. Veuillez réessayer plus tard.`, ephemeral: true });
        }
    }
};
