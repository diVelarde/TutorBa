const express = require('express');
const app = express();
const port = 3000;

import uploadRoutes from "./routes/uploadRoutes.js";

app.use(express.json());

app.use("/api/files", uploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});