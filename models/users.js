const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "users",
        {
            userId: {
                type: Sequelize.STRING,
                unique: true
            },
            username: {
                type: Sequelize.STRING,
                unique: true
            },
            pseudo: {
                type: Sequelize.STRING,
                unique: true
            },
            power: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            positionTour: {
                type: Sequelize.STRING,
            },
        },
        {
            timestamps: false
        }
    );
};
