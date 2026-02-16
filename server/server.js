const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB, User } = require('./models');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('MDI Typing Tutor API Running');
});

// Import Routes (to be created)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
// app.use('/api/admin', require('./routes/admin'));

// Initialize DB and Seed Admin
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await initDB();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

// Only start server if run directly (locally)
if (require.main === module) {
    startServer();
}

// Export for Vercel
module.exports = app;
