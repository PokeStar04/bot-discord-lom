const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "montures",
        {
            tier: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            nombreEtoile: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            nombreRessortToUp: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            cumulRessortToUp: {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        },
        {
            timestamps: false
        }
    );
};
