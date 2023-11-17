const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "filemanager",
  "postgres",
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;
