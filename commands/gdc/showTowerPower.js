const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show_tower_power")
        .setDescription("Affiche la somme de la puissance des joueurs pour chaque tour"),

    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        try {
            // Définir les positions à rechercher
            const positions = ['H', 'M', 'B'];

            // Différer la réponse initiale à l'interaction
            await interaction.deferReply();

            // Initialiser un objet pour stocker les sommes de puissance pour chaque position
            const powerSummaries = {};

            // Parcourir chaque position
            for (const position of positions) {
                // Récupérer les utilisateurs pour la position actuelle
                const usersInPosition = await Users.findAll({
                    where: { positionTour: position }
                });

                // Calculer la somme de la puissance pour cette position
                const totalPower = usersInPosition.reduce((total, user) => total + user.power, 0);

                // Formater le total de puissance avec la virgule déplacée
                const formattedTotalPower = (totalPower / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                // Stocker la somme de puissance dans l'objet powerSummaries
                powerSummaries[position] = formattedTotalPower;
            }

            // Construire le message avec les sommes de puissance pour chaque position
            let message = "Somme de la puissance pour chaque tour :\n";
            for (const position in powerSummaries) {
                const positionString = position === "H" ? "Tour du Haut" : (position === "M" ? "Tour du Milieu" : "Tour du Bas");
                message += `${positionString}: ${powerSummaries[position]}M\n`;
            }

            // Envoyer le message contenant toutes les sommes de puissance
            await interaction.followUp(message);
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'exécution de la commande show_tower_power:", error);
            return interaction.reply("Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer plus tard.");
        }
    }
};
