import express from 'express';
import mongoose from 'mongoose';
import tutorRoutes from './routes/tutorRoutes.js';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/tutors', tutorRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});