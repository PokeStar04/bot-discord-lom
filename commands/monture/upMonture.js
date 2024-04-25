const { SlashCommandBuilder } = require("discord.js");
const { Montures } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("up_monture")
        .setDescription("Calcule le coût de ressort pour augmenter le niveau de ta monture")
        .addIntegerOption(option =>
            option.setName("tier")
                .setDescription("Tier de la monture")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("star")
                .setDescription("Étoile de la monture")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("tier_voulu")
                .setDescription("Tier de la monture souhaité")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("star_voulue")
                .setDescription("Étoile de la monture souhaitée")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("nombre_ressort")
                .setDescription("Nombre de ressorts (optionnel)")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("nombre_gemme")
                .setDescription("Nombre de gemmes (optionnel)")
                .setRequired(true)),
    async execute(interaction) {
        try {
            const tier = interaction.options.getInteger("tier");
            const star = interaction.options.getInteger("star");
            const tier_voulu = interaction.options.getInteger("tier_voulu");
            const star_voulue = interaction.options.getInteger("star_voulue");
            const nombre_ressort = interaction.options.getInteger("nombre_ressort");
            const nombre_gemme = interaction.options.getInteger("nombre_gemme");
            if (star_voulue == 0) {
                star_voulue = 1;
            }
            if (tier_voulu > 7 || (tier_voulu === 7 && star_voulue > 7) || tier > 7 || (tier === 7 && star > 7)) {
                return interaction.reply({ content: "Les données pour cette monture ne sont pas encore disponibles.Le rang maximal est tier 7 et 8 étoiles", ephemeral: true });
            }
            const cumulRessort = await Montures.findOne({
                where: {
                    tier: tier,
                    nombreEtoile: star,
                }
            });
            const cumulRessortNewTier = await Montures.findOne({
                where: {
                    tier: tier_voulu,
                    nombreEtoile: star_voulue
                }
            });
            const ressortActuel = cumulRessort.cumulRessortToUp;
            const totalRessort = cumulRessortNewTier.cumulRessortToUp;
            const numberClockerBuyByGemmes = nombre_gemme / 35;
            const numberClockWithGemmes = Math.floor(numberClockerBuyByGemmes);
            const numberClockForUpgrade = totalRessort - ressortActuel - nombre_ressort;
            const clockAfterGemmes = numberClockForUpgrade - numberClockWithGemmes;

            if (numberClockForUpgrade > 0) {
                if (clockAfterGemmes <= 0) {
                    // Gemmes restantes
                    const newGemme = clockAfterGemmes * (-35);
                    const ressortRestant = clockAfterGemmes * -1;
                    return interaction.reply(`Ressort Restant : **${ressortRestant}**\nGemmes restantes : **${newGemme}** `);
                } else {
                    // Gemmes manquantes
                    const ressortRestant = clockAfterGemmes;
                    const newGemme = clockAfterGemmes * 35;
                    return interaction.reply(`Ressort Manquant : **${ressortRestant}** ressorts\nGemmes Manquante : **${newGemme}** gemmes`);
                }
            } else {
                return interaction.reply(`Ressort Restant : **${numberClockForUpgrade * -1}** ressorts\nAucune Gemme depensé  : **${nombre_gemme}** restante.`);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'exécution de la commande upMonture:", error);
            // return interaction.reply("Une erreur s'est produite lors de l'exécution de la commande upMonture. Veuillez réessayer plus tard.");
        }
    }
};
