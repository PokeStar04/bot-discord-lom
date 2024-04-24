const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_gdc_reset_all_tour")
        .setDescription("Commande réservée aux administrateurs pour réinitialiser les tours de tous les joueurs."),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Vérifier si l'utilisateur qui a émis la commande est un administrateur
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            await interaction.reply({ content: "Êtes-vous sûr de vouloir réinitialiser les tours de tous les joueurs ? Cette action est irréversible.", ephemeral: true });

            const filter = (response) => {
                return response.user.id === interaction.user.id;
            };

            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async (response) => {
                const content = response.content.toLowerCase();
                if (content === 'oui' || content === 'yes') {
                    try {
                        // Réinitialiser la valeur "positionTour" pour tous les joueurs
                        const affectedRows = await Users.update({ positionTour: null }, { where: {} });

                        interaction.reply({ content: `Tous les tours des joueurs ont été réinitialisés avec succès. Nombre de joueurs affectés : ${affectedRows}`, ephemeral: true });
                    } catch (error) {
                        console.error("Une erreur s'est produite lors de la réinitialisation des tours des joueurs :", error);
                        interaction.reply({ content: "Une erreur s'est produite lors de la réinitialisation des tours des joueurs. Veuillez réessayer plus tard.", ephemeral: true });
                    }
                } else {
                    interaction.reply({ content: "Réinitialisation annulée.", ephemeral: true });
                }
                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.reply({ content: "Temps écoulé. Réinitialisation annulée.", ephemeral: true });
                }
            });
        } else {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }
    }
};
