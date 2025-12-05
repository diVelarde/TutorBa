import express from 'express';
import mongoose from 'mongoose';
import tutorRoutes from './routes/tutorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import favoritesRouter from './routes/favoriteRoutes.js';
import { config } from 'dotenv';

config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (use relative paths)
const reviewsRouter = require('./routes/reviews');
const sessionsRouter = require('./routes/sessions');
const messagesRouter = require('./routes/messages');
const favoritesRouter = require('./routes/favorites');

app.use('/api/reviews', reviewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/favorites', favoritesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});