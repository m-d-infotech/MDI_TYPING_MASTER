const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is missing');
        }

        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await connection.execute('SELECT 1 as val');
        await connection.end();

        res.json({
            status: 'success',
            message: 'Raw mysql2 connection successful',
            result: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Raw mysql2 connection failed',
            error: error.message,
            stack: error.stack
        });
    }
};
