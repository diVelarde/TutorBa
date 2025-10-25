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

// Routes
const reviewsRouter = require('./routes/reviews');
const sessionsRouter = require('./routes/sessions');

app.use('/api/reviews', reviewsRouter);
app.use('/api/sessions', sessionsRouter);
const sessionsRouter = require('vary/routes/sessions');

app.use('/api/reviews', reviewsRouter);
app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
    res.send('TutorBa API Server');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
