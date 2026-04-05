const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolios');
const publicRoutes = require('./routes/public');
const aiRoutes = require('./routes/ai');
const githubRoutes = require('./routes/github');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Portify API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/github', githubRoutes);

module.exports = app;