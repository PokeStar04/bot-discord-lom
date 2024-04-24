const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Met à jour ton pseudo")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Votre nouveau pseudo')
                .setRequired(true)),
    async execute(interaction) {

        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }
        const newPseudo = interaction.options.getString('pseudo');
        const userId = interaction.user.id;

        try {
            const user = await Users.update(
                { pseudo: newPseudo },
                { where: { userId: userId } }
            );

            if (user) {
                return interaction.reply(`Pseudo mis à jour avec succès.`);
            } else {
                return interaction.reply("Vous n'êtes pas encore enregistré. Utilisez la commande `/login` pour vous inscrire.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour du pseudo:", error);
            return interaction.reply("Une erreur s'est produite lors de la mise à jour du pseudo. Veuillez réessayer plus tard.");
        }
    }
};
