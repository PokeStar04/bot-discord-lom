const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");

const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_force_login")
        .setDescription("Enregister un joueur de force avec son ID est username discord")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription('Votre pseudo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('id')
                .setDescription("L'ID de l'utilisateur")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription("Le nom d'utilisateur")
                .setRequired(true)),
    async execute(interaction) {
        const pseudo = interaction.options.getString('pseudo');
        const userId = interaction.options.getString('id');
        const username = interaction.options.getString('username');

        try {
            const user = await Users.findOrCreate({
                where: { userId: userId },
                defaults: { userId: userId, username: username, pseudo: pseudo }
            });

            if (user[1]) {
                await interaction.reply({ content: `Utilisateur ${pseudo} ajouté.`, ephemeral: true });
            } else {
                console.log("Utilisateur déjà créé.");
                await interaction.reply({ content: "Vous êtes déjà enregistré.", ephemeral: true });
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la recherche/création de l'utilisateur:", error);
            await interaction.reply({ content: `Une erreur s'est produite lors de la recherche/création de l'utilisateur. Veuillez réessayer plus tard.`, ephemeral: true });
        }
    }
};
