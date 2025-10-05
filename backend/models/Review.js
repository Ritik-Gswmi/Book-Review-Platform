
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  rating: {type: Number, min:1, max:5, required: true},
  reviewText: String
}, {timestamps: true});
module.exports = mongoose.model('Review', ReviewSchema);
