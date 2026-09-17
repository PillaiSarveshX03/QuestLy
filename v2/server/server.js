const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check endpoint for container monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'questly-server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// QuestLy API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 QuestLy Server running on port ${PORT}`));