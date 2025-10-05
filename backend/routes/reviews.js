
// Helper: recalculate average rating for a book
async function recalcAverage(bookId) {
  const mongoose = require('mongoose');
  const agg = await Review.aggregate([
    { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
    { $group: { _id: '$bookId', avg: { $avg: '$rating' } } }
  ]);
  const avg = agg[0] ? Number(agg[0].avg.toFixed(2)) : 0;
  await Book.findByIdAndUpdate(bookId, { averageRating: avg });
}


// routes/reviews.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { addReview, getReviews } = require("../controllers/reviewController.js");

// Add review for a book
router.post('/:bookId', addReview);

// Get all reviews for a specific book
router.get('/:bookId', getReviews);

// Get all reviews (admin/testing)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('bookId', 'title author')
      .populate('userId', 'name email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review (direct logic, requires auth)
router.post('/', auth, async (req,res)=>{
try{
  const {bookId, rating, reviewText} = req.body;
  if(!bookId || !rating) return res.status(400).json({message:'Missing fields'});
  const book = await Book.findById(bookId);
  if(!book) return res.status(404).json({message:'Book not found'});
  const existing = await Review.findOne({bookId, userId: req.user.id});
  if(existing) return res.status(400).json({message:'You already reviewed. Edit instead.'});
  const r = await Review.create({bookId, rating, reviewText, userId: req.user.id});
  // Recalculate average rating
  await recalcAverage(bookId);
  res.json(r);
}catch(err){res.status(500).json({message:err.message});}
});

// Edit review
router.put('/:id', auth, async (req,res)=>{
try{
  const rev = await Review.findById(req.params.id);
  if(!rev) return res.status(404).json({message:'Not found'});
  if(rev.userId.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
  Object.assign(rev, req.body);
  await rev.save();
  // Recalculate average for the book
  await recalcAverage(rev.bookId);
  res.json(rev);
}catch(err){res.status(500).json({message:err.message});}
});


// Delete review (authenticated user)
router.delete('/:id', auth, async (req,res)=>{
try{
  const rev = await Review.findById(req.params.id);
  if(!rev) return res.status(404).json({message:'Not found'});
  if(rev.userId.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
  const bookId = rev.bookId;
  await rev.deleteOne();
  // Recalculate average for the book
  await recalcAverage(bookId);
  res.json({message:'Deleted'});
}catch(err){res.status(500).json({message:err.message});}
});

module.exports = router;