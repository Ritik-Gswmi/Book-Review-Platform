//book.js
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String }, // <-- added description
  genre: { type: String },
  publishedYear: { type: Number },
  averageRating: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // renamed to addedBy to match routes
});

// If a book is deleted, also remove its reviews
BookSchema.pre("remove", async function (next) {
  try {
    await mongoose.model("Review").deleteMany({ bookId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});



// Also handle deleteOne (document) so cleanup runs when using deleteOne()
BookSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    await mongoose.model("Review").deleteMany({ bookId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Book", BookSchema);
