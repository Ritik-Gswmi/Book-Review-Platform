
// controllers/reviewController.js
const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

//  GET all reviews for a specific book
exports.getReviews = async (req, res) => {
  try {
  const { bookId } = req.params;

// Fetch all reviews related to that book and populate related info
const reviews = await Review.find({ bookId })
.populate('userId', 'name email')  // show reviewer name & email
.populate('bookId', 'title author'); // optional, for debugging or UI

   if (!reviews || reviews.length === 0) {
   return res.json([]); // no reviews found
   }

res.json(reviews);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

//  POST Add new review (and update books average rating)
exports.addReview = async (req, res) => {
try {
    const { bookId } = req.params;
    const { rating, reviewText, userId } = req.body;

    if (!bookId || !rating || !userId)
    return res.status(400).json({ message: 'Missing required fields' });

    // Verify that book and user exist
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicate review from same user (optional)
    const existing = await Review.findOne({ bookId, userId });
    if (existing) {
    return res.status(400).json({ message: 'You already reviewed this book.' });
    }

    // Create the review
    const newReview = new Review({ bookId, rating, reviewText, userId });
    await newReview.save();

    // Update average rating for the book
    const allReviews = await Review.find({ bookId });
    const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    book.averageRating = avgRating.toFixed(1);
    await book.save();

    // Send updated book and review in response
    res.status(201).json({
    message: 'Review added successfully',
    review: newReview,
    updatedBook: {
    id: book._id,
    title: book.title,
    averageRating: book.averageRating,
    },
    });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

//  DELETE all reviews if book deleted (cleanup function)
exports.deleteReviewsByBook = async (bookId) => {
  try {
  await Review.deleteMany({ bookId });
  } catch (err) {
  console.error('Error deleting reviews for book:', err);
  }
};