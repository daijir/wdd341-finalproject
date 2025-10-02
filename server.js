const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const borrowRoutes = require('./routes/borrowRoutes.js');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/library', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', bookRoutes);
app.use('/', userRoutes);
app.use('/', reviewRoutes);
app.use('/', borrowRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
