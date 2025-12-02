const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tutorba', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

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
    res.send('TutorBa API Server');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
