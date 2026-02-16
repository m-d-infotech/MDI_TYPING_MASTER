const { Sequelize } = require("sequelize");
const mysql2 = require('mysql2'); // Explicit require for Vercel
require("dotenv").config();

let sequelize;

try {
    if (process.env.DATABASE_URL) {
        console.log("Connecting using DATABASE_URL...");
        const dbUrl = new URL(process.env.DATABASE_URL);
        
        sequelize = new Sequelize(
            dbUrl.pathname.substring(1), // database name
            dbUrl.username,
            dbUrl.password,
            {
                host: dbUrl.hostname,
                port: dbUrl.port,
                dialect: 'mysql',
                dialectModule: mysql2,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false
            }
        );
    } else {
        console.log("Connecting using local config...");
        sequelize = new Sequelize(
            process.env.DB_NAME || "mdi_typing_tutor",
            process.env.DB_USER || "root",
            process.env.DB_PASS || "",
            {
                host: process.env.DB_HOST || "localhost",
                dialect: "mysql",
                logging: false,
            }
        );
    }
} catch (error) {
    console.error("Critical Error in database.js:", error);
    // Use a dummy instance to prevent crash during module load, will fail at connection time
    sequelize = new Sequelize('sqlite::memory:'); 
}

module.exports = sequelize;
