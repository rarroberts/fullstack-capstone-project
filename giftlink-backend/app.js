/*jshint esversion: 8 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo/index');

const app = express();
const port = 3060;

// Enable CORS
app.use('*', cors());

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => {
        console.error('Failed to connect to DB', e);
    });

// Parse JSON request bodies
app.use(express.json());

// HTTP request logger
app.use(pinoHttp({ logger: pinoLogger }));

// Route files

// Gift API Task 1:
const giftroutes = require('./routes/giftRoutes');

// Search API Task 1:
const searchRoutes = require('./routes/searchRoutes');

// Auth API Task 1:
const authRoutes = require('./routes/authRoutes');

// Use Routes

// Gift API Task 2:
app.use('/api/gifts', giftroutes);

// Search API Task 2:
app.use('/api/search', searchRoutes);

// Auth API Task 2:
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Root route
app.get('/', (req, res) => {
    res.send('Inside the server');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
