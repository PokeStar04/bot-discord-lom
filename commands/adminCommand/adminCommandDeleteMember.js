const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_delete_member")
        .setDescription("Commande réservée aux administrateurs pour supprimer un utilisateur de la base de données")
        .addStringOption(option =>
            option.setName('pseudo')
                .setDescription("Le pseudo de l'utilisateur à supprimer de la base de données")
                .setRequired(true)),
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

        // Récupérer le pseudo de l'utilisateur à supprimer
        const pseudo = interaction.options.getString('pseudo');

        // Envoyer un message demandant la confirmation de l'utilisateur
        const confirmationMessage = await interaction.reply({
            content: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${pseudo} de la base de données ? Cette action est irréversible.`,
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
                // L'utilisateur a confirmé, mettre en œuvre la suppression
                try {
                    const deletedUser = await Users.destroy({ where: { pseudo: pseudo } });
                    if (deletedUser) {
                        await interaction.editReply({ content: `L'utilisateur ${pseudo} a été supprimé de la base de données avec succès.` });
                    } else {
                        await interaction.editReply({ content: `Aucun utilisateur trouvé avec le pseudo ${pseudo}.` });
                    }
                } catch (error) {
                    console.error("Une erreur s'est produite lors de la suppression de l'utilisateur :", error);
                    await interaction.editReply({ content: "Une erreur s'est produite lors de la suppression de l'utilisateur. Veuillez réessayer plus tard." });
                }
            } else if (reaction.emoji.name === '❌') {
                // L'utilisateur a annulé, répondre en conséquence
                await interaction.editReply({ content: "Suppression annulée." });
            }

            // Arrêter le collecteur d'événements
            collector.stop();
        });

        // Gérer l'expiration du collecteur d'événements
        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await interaction.editReply({ content: "Temps écoulé. Suppression annulée." });
            }
        });
    }
};
