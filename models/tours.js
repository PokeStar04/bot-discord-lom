const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "tours",
        {
            positionTour: {
                type: Sequelize.STRING,
            },
            username: {
                type: Sequelize.STRING,
                unique: true
            },
            power: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
        },
        {
            timestamps: false
        }
    );
};
