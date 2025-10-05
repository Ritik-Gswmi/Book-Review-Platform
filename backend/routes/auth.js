//auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');
require('dotenv').config();

// Root route
router.get("/", (req, res) => {
  res.json({ message: "Auth API root. Use POST /signup, POST /login, GET /me, or GET /all." });
});

// Signup
router.post('/signup', async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({message:'Email exists'});
    const hashed = await bcrypt.hash(password, 10);
    const u = await User.create({name,email,password:hashed});
    const token = jwt.sign({id: u._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user: {id:u._id, name:u.name, email:u.email}});
  }catch(err){res.status(500).json({message:err.message});}
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email||!password) return res.status(400).json({message:'Missing fields'});
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({id: u._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user: {id:u._id, name:u.name, email:u.email}});
  }catch(err){res.status(500).json({message:err.message});}
});

// Get logged-in user details
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (⚠️ optional: restrict this to admin later)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user account and all their content
router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find user to ensure they exist
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all reviews by this user
    await Review.deleteMany({ userId: userId });
    // Delete all books added by this user (and their reviews)
    await Book.deleteMany({ addedBy: userId });
    // Finally, delete the user
    await user.remove();
    res.json({ message: "User account and all associated data deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;