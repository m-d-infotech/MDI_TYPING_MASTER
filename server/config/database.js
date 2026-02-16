const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME || "mdi_typing_tutor",
      process.env.DB_USER || "root",
      process.env.DB_PASS || "",
      {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
      }
    );

module.exports = sequelize;
