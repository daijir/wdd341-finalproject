const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  isbn: String,
  stock: Number
});

module.exports = mongoose.model('Book', bookSchema);
