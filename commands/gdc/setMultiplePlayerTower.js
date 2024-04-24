const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../dbObjects.js");
const allowedGuildId = '1227242012390985738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin_gdc_set_multiple_p_tower")
        .setDescription("Commande réservée aux administrateurs")
        .addStringOption(option =>
            option.setName('pseudos')
                .setDescription("Les pseudos des joueurs IG, séparés par des virgules")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tour')
                .setDescription("Indiquez dans quel tour ils doivent aller 'H' ou 'M' ou 'B' ")
                .setRequired(true)),
    async execute(interaction) {
        // Vérifier si la commande a été exécutée sur le serveur autorisé
        if (interaction.guildId !== allowedGuildId) {
            return interaction.reply("Désolé, cette commande n'est pas autorisée sur ce serveur.");
        }

        // Vérifier si l'utilisateur qui a émis la commande est un administrateur
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            const pseudos = interaction.options.getString('pseudos').split(',').map(pseudo => pseudo.trim());
            const tour = interaction.options.getString('tour');
            let positionString = ""
            if (tour == "H") {
                positionString = "Haut"
            }
            if (tour == "M") {
                positionString = "Millieu"
            }
            if (tour == "B") {
                positionString = "Bas"
            }
            try {
                // Mettre à jour les données des utilisateurs cibles dans la base de données
                const promises = pseudos.map(async pseudo => {
                    const [affectedRows] = await Users.update({ positionTour: tour }, { where: { pseudo: pseudo } });
                    return { pseudo: pseudo, affectedRows: affectedRows };
                });

                const results = await Promise.all(promises);

                const updatedUsers = results.filter(result => result.affectedRows > 0).map(result => result.pseudo);
                const notFoundUsers = pseudos.filter(pseudo => !updatedUsers.includes(pseudo));

                let replyMessage = `La Tour de ${updatedUsers.join(', ')} est désormais ${positionString}.`;

                if (notFoundUsers.length > 0) {
                    replyMessage += `\nLes utilisateurs suivants n'ont pas été trouvés: ${notFoundUsers.join(', ')}.`;
                }

                return interaction.reply(replyMessage);
            } catch (error) {
                console.error(`Une erreur s'est produite lors de la mise à jour des données des utilisateurs: ${pseudos}`, error);
                return interaction.reply(`Une erreur s'est produite lors de la mise à jour des données des utilisateurs ${pseudos}. Veuillez réessayer plus tard.`);
            }
        } else {
            // Si l'utilisateur n'est pas administrateur, répondre avec un message d'erreur
            return interaction.reply("Désolé, vous devez être administrateur pour exécuter cette commande.");
        }
    }
};
