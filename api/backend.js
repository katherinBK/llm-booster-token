// api/backend.js
// Vercel Serverless adapter: wraps the Express app for serverless execution.
// This file does NOT change any logic - it just exports the app as a handler.

import app from '../backend/index.js';

export default app;
