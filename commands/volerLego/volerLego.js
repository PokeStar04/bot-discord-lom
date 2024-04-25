const { SlashCommandBuilder } = require("discord.js");

const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voler_lego_pour_toujours")
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
        const tempsTotalEnSecondes = heure * 3600 + minute * 60 + seconde - 20;
        if (tempsTotalEnSecondes < 0) {
            return interaction.reply("Désolé, la durée spécifiée est trop courte. Veuillez entrer une durée d'au moins 20 secondes.");
        }


        try {
            // Envoyer le message immédiatement après avoir calculé le temps total
            await interaction.reply({ content: `Message envoyé dans ${heure} heures, ${minute} minutes et ${seconde} secondes.`, ephemeral: false });
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'envoi du message:", error);
        }

        // Déclencher l'envoi du message après le temps spécifié
        setTimeout(async () => {
            try {
                // Pinguer les utilisateurs dans le message
                const userPing = ['628635503163473929', '503211192970510365', '775726795089379368'];
                const mentionedUsers = userPing.map(user => `<@${user}>`).join(' ');
                await interaction.followUp({ content: `${mentionedUsers},Go le voler! #MALVEILLANCE MAX`, ephemeral: false });
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'envoi du message:", error);
            }
        }, tempsTotalEnSecondes * 1000); // setTimeout attend des millisecondes
    }

};
