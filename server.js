import express from 'express';
import mongoose from 'mongoose';
import tutorRoutes from './routes/tutorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { config } from 'dotenv';

config();

const app = express();
const port = 3000;

import uploadRoutes from "./routes/uploadRoutes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tutors", tutorRoutes);
app.use("/api/profiles", profileRoutes);

app.use("/api/files", uploadRoutes);

// Routes
const favoritesRouter = require('./routes/favorites');

app.use('/api/favorites', favoritesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});