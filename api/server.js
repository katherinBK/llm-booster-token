// Vercel Serverless Function entry point.
// This file bridges the Vercel platform to the Express app in /backend.
// Vercel detects files inside /api/ and serves them as serverless functions.
import app from '../backend/index.js';

export default app;
