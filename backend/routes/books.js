
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');

// Create book
router.post('/', auth, async (req,res)=>{
  try{
    const data = {...req.body, addedBy: req.user.id};
    const book = await Book.create(data);
    res.json(book);
  }catch(err){res.status(500).json({message:err.message});}
});

// List books with pagination (5 per page)
router.get('/', async (req,res)=>{
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page-1)*limit;
    const total = await Book.countDocuments();
    const books = await Book.find().sort({createdAt:-1}).skip(skip).limit(limit);
    res.json({books, page, totalPages: Math.ceil(total/limit), total});
  }catch(err){res.status(500).json({message:err.message});}
});

// Get book details + reviews + average
router.get('/:id', async (req,res)=>{
  try{
    const book = await Book.findById(req.params.id).lean();
    if(!book) return res.status(404).json({message:'Not found'});
    let reviews = await Review.find({bookId: book._id}).populate('userId','name').sort({createdAt:-1}).lean();
    // Filter out reviews where the user has been deleted (userId is null after populate)
    const validReviews = reviews.filter(review => review.userId);

    const avg = validReviews.length ? (validReviews.reduce((s,r)=>s+r.rating,0)/validReviews.length).toFixed(2) : null;
    res.json({book, reviews: validReviews, averageRating: avg});
  }catch(err){res.status(500).json({message:err.message});}
});

// Update book (only owner)
router.put('/:id', auth, async (req,res)=>{
  try{
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:'Not found'});
    if(book.addedBy.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  }catch(err){res.status(500).json({message:err.message});}
});

// Delete book (only owner) + its reviews
router.delete('/:id', auth, async (req,res)=>{
  try{
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:'Not found'});
    if(book.addedBy.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    await Review.deleteMany({bookId: book._id});
    await book.deleteOne();
    res.json({message:'Deleted'});
  }catch(err){res.status(500).json({message:err.message});}
});

module.exports = router;
