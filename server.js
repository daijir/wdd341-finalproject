const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { connectToDb } = require('./mongodb/connection.js');
const bookRoutes = require('./routes/bookRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const borrowRoutes = require('./routes/borrowRoutes.js');

const uri = process.env.MONGO_URI;
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', bookRoutes);
app.use('/', userRoutes);
app.use('/', reviewRoutes);
app.use('/', borrowRoutes);

// Main route
app.use('/', (req, res) => {
    res.send("Hello, this is a service for books!");
});

/*
    * Connect to MongoDB and start the server
*/
connectToDb((error) => {
    if (!error) {
        console.log('Connected to MongoDB');
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('Mongoose connected to MongoDB'))
            .catch(err => console.error('Mongoose connection error:', err));

        app.listen(port, () => {
            console.log(`Server is running on PORT: ${port}`)
        });
    } else {
        console.error('Failed to connect to MongoDB', error);
    }
});
