const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_gdc_reset_all_tower")
        .setDescription("Commande réservée aux administrateurs pour réinitialiser les tours de tous les joueurs."),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Vérifier si l'utilisateur qui a émis la commande est un administrateur
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }

        // Envoyer un message demandant la confirmation de l'utilisateur
        const confirmationMessage = await interaction.reply({
            content: "Êtes-vous sûr de vouloir réinitialiser les tours de tous les joueurs ? Cette action est irréversible.",
            fetchReply: true // Ceci permet de récupérer le message pour ajouter des boutons d'interaction
        });

        // Ajouter des boutons d'interaction pour permettre à l'utilisateur de répondre
        await confirmationMessage.react('✅'); // Bouton pour confirmer
        await confirmationMessage.react('❌'); // Bouton pour annuler

        // Créer un collecteur d'événements pour attendre la réponse de l'utilisateur
        const collector = confirmationMessage.createReactionCollector({
            time: 15000, // Temps en millisecondes
            dispose: true // Permet de capturer les réactions retirées
        });

        // Gérer les réactions collectées
        collector.on('collect', async (reaction, user) => {
            if (user.id !== interaction.user.id) return; // Ignorer les réactions des autres utilisateurs

            if (reaction.emoji.name === '✅') {
                // L'utilisateur a confirmé, mettre en œuvre la réinitialisation
                // Réinitialiser la valeur "positionTour" pour tous les joueurs
                try {
                    const affectedRows = await Users.update({ positionTour: null }, { where: {} });
                    await interaction.editReply({ content: `Tous les tours des joueurs ont été réinitialisés avec succès. Nombre de joueurs affectés : ${affectedRows}` });
                } catch (error) {
                    console.error("Une erreur s'est produite lors de la réinitialisation des tours des joueurs :", error);
                    await interaction.editReply({ content: "Une erreur s'est produite lors de la réinitialisation des tours des joueurs. Veuillez réessayer plus tard." });
                }
            } else if (reaction.emoji.name === '❌') {
                // L'utilisateur a annulé, répondre en conséquence
                await interaction.editReply({ content: "Réinitialisation annulée." });
            }

            // Arrêter le collecteur d'événements
            collector.stop();
        });

        // Gérer l'expiration du collecteur d'événements
        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await interaction.editReply({ content: "Temps écoulé. Réinitialisation annulée." });
            }
        });
    }
}
