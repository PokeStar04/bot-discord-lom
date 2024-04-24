const { Events } = require("discord.js");
const { Users } = require("../dbObjects.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
    }
};
