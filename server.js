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

app.use("/api/tutors", tutorRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/files", uploadRoutes);
app.use('/api/favorites', favoritesRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});