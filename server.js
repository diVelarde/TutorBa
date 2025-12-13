import express from 'express';
import { config } from 'dotenv';
import tutorRoutes from './routes/tutorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import favoritesRouter from './routes/favoriteRoutes.js';
import reviewsRouter from './routes/reviews.js';
import sessionsRouter from './routes/sessions.js';
import messagesRouter from './routes/messages.js';
import connectDB from './config/database.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Route middlewares
app.use('/api/tutors', tutorRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/favorites', favoritesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/messages', messagesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
