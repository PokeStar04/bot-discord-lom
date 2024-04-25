const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "voleLego",
        {
            heure: {
                type: Sequelize.INTEGER,
            },
            minute: {
                type: Sequelize.INTEGER,
            },
            seconde: {
                type: Sequelize.INTEGER,
            },
        },
        {
            timestamps: false
        }
    );
};
