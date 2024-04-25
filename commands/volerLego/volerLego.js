const { SlashCommandBuilder } = require("discord.js");
// const { Users } = require("../../dbObjects.js");

// ID du serveur spécifique où vous souhaitez autoriser l'exécution de la commande
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voler_lego")
        .setDescription("Mettre l'heure de a laquelle c'est plantation sont finis")
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

        // Déclencher l'envoi du message après le temps spécifié
        setTimeout(async () => {
            try {
                // Envoyer le message après le temps spécifié
                await interaction.reply({ content: "Le temps est écoulé!", ephemeral: true });
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'envoi du message:", error);
            }
        }, tempsTotalEnSecondes * 1000); // setTimeout attend des millisecondes

        await interaction.reply({ content: `Message envoyé dans ${heure} heures, ${minute} minutes et ${seconde} secondes.`, ephemeral: true });
    }
};
