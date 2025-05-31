import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import { authenticate } from './middleware/auth.js';

const app = express();

app.use(
  cors({
    origin: ['https://astra-ai-six.vercel.app/', 'localhost:3000'],
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
