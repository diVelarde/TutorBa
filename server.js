const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Routes
const favoritesRouter = require('./routes/favorites');

app.use('/api/favorites', favoritesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});