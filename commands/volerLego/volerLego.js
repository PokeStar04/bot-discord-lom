const { SlashCommandBuilder } = require("discord.js");

const allowedGuildId = '1227322579564626020';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voler_lego")
        .setDescription("Mettre l'heure à laquelle c'est plantations sont finies")
        .addNumberOption(option =>
            option.setName('heure')
                .setDescription('heure')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('minute')
                .setDescription('minute')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('seconde')
                .setDescription('seconde')
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Récupérer les valeurs des options
        const heure = interaction.options.getNumber('heure');
        const minute = interaction.options.getNumber('minute');
        const seconde = interaction.options.getNumber('seconde');

        // Calculer le temps total en secondes
        const tempsTotalEnSecondes = heure * 3600 + minute * 60 + seconde;

        try {
            // Envoyer le message immédiatement après avoir calculé le temps total
            await interaction.reply({ content: `Message envoyé dans ${heure} heures, ${minute} minutes et ${seconde} secondes.`, ephemeral: true });
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'envoi du message:", error);
        }

        // Déclencher l'envoi du message après le temps spécifié
        setTimeout(async () => {
            try {
                // Envoyer le message après le temps spécifié
                await interaction.followUp({ content: "Le temps est écoulé!", ephemeral: true });
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'envoi du message:", error);
            }
        }, tempsTotalEnSecondes * 1000); // setTimeout attend des millisecondes
    }

};
