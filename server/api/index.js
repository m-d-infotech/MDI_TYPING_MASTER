const app = require('../server');
const { initDB } = require('../models');

// Initialize DB on cold start (if needed, though Sequelize handles connection pool)
// Note: syncing models on every serverless invocation is bad for performance, 
// strictly we should rely on migrations, but for this app structure:
let dbInitialized = false;

module.exports = async (req, res) => {
    if (!dbInitialized) {
        await initDB();
        dbInitialized = true;
    }
    app(req, res);
};
