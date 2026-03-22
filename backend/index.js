const express = require('express');
const cors = require('cors');
require('dotenv').config();

const llmRoutes = require('./routes/llm.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/v1', llmRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('SERVER CRASHED (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('SERVER CRASHED (Unhandled Rejection):', reason);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
