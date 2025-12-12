import express from 'express';
import { config } from 'dotenv';
import tutorRoutes from './routes/tutorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import favoritesRouter from './routes/favoriteRoutes.js';
import connectDB from './config/database.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import CommonJS routers using require for compatibility
const reviewsRouter = require('./routes/reviews');
const sessionsRouter = require('./routes/sessions');
const messagesRouter = require('./routes/messages');

// Connect to MongoDB
connectDB();

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