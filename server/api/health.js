const mysql = require('mysql2');

module.exports = (req, res) => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        const driverLoaded = !!mysql;
        
        res.status(200).json({
            status: 'online',
            message: 'Health check passed',
            env: {
                hasDatabaseUrl: !!dbUrl,
                databaseUrlLength: dbUrl ? dbUrl.length : 0,
                nodeVersion: process.version
            },
            driver: {
                mysql2: driverLoaded ? 'loaded' : 'failed'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'crash',
            error: error.message,
            stack: error.stack
        });
    }
};
