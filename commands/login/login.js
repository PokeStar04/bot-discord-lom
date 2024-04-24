const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");

// ID du serveur spécifique où vous souhaitez autoriser l'exécution de la commande
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Se connecter")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Votre pseudo')
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        const pseudo = interaction.options.getString('pseudo');
        const username = interaction.user.username;
        const userId = interaction.user.id;

        try {
            const [user, created] = await Users.findOrCreate({
                where: { username: username },
                defaults: { userId: userId, username: username, pseudo: pseudo }
            });

            if (created) {
                await interaction.reply({ content: `Utilisateur ${user.pseudo} ajouté.`, ephemeral: true });
            } else {
                console.log("Utilisateur déjà créé.");
                await interaction.reply({ content: "Vous êtes déjà enregistré.", ephemeral: true });
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la création de l'utilisateur:", error);
            await interaction.reply({ content: `Une erreur s'est produite lors de la création de l'utilisateur. Veuillez réessayer plus tard.`, ephemeral: true });
        }
    }
};
