const sequelize = require("../db/db");
const Sequelize = require("sequelize");

console.log("inside the user model");
const rootFolder = sequelize.define("rootfolder", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  foldername: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = rootFolder;
