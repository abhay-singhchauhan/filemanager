const sequelize = require("../db/db");
const Sequelize = require("sequelize");

console.log("inside the user model");
const fileData = sequelize.define("fileData", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fileSize: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fileLocation: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = fileData;
