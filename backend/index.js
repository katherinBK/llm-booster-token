import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';

import llmRoutes from './routes/llm.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/v1', llmRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Solo levanta el servidor HTTP cuando se ejecuta directamente (npm run dev local).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
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
}

export default app;
