


const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription("Donne le lien du wiki"),
    async execute(interaction) {


        try {

            await interaction.reply({ content: `Le lien du wiki : https://kinoko-wiki.com/`, ephemeral: true });

        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du lien", error);
            await interaction.reply({ content: `Une erreur s'est produite lors de la recupération du lien. Veuillez réessayer plus tard.`, ephemeral: true });
        }
    }
};
