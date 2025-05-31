import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import { authenticate } from './middleware/auth.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : false,
    credentials: true,
  })
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/jobs', authenticate, jobsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Astra AI Backend!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
