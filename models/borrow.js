const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowedAt: {
    type: Date,
    default: Date.now
  },
  returnedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned'],
    default: 'borrowed'
  }
});

module.exports = mongoose.model('Borrow', borrowSchema);
