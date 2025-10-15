const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  genre: String,
  yearPublished: Number,
  copiesAvailable: {
    type: Number,
    min: 0
  }
});

module.exports = mongoose.model('Book', bookSchema);
