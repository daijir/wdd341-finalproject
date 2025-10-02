const express = require('express');
const mongoose = require('mongoose');
const { connectToDb } = require('./mongodb/connection.js');
const bookRoutes = require('./routes/bookRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const borrowRoutes = require('./routes/borrowRoutes.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', bookRoutes);
app.use('/', userRoutes);
app.use('/', reviewRoutes);
app.use('/', borrowRoutes);

/*
    * Connect to MongoDB and start the server
*/
connectToDb((error) => {
    if (!error) {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on PORT: ${port}`)
        });
    } else {
        console.error('Failed to connect to MongoDB', error);
    }
});
