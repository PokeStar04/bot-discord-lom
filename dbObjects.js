const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite"
});

const Users = require("./models/users.js")(sequelize, Sequelize.DataTypes);
const Tours = require("./models/tours.js")(sequelize, Sequelize.DataTypes);
const Montures = require("./models/montures.js")(sequelize, Sequelize.DataTypes);

// Monsters.belongsToMany(Stages, { through: MonsterStages });
// Stages.belongsToMany(Monsters, { through: MonsterStages });

module.exports = { Users, Tours, Montures };
