//user.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// ✅ Cascade delete user's books and reviews when user is removed
UserSchema.pre("remove", async function (next) {
  try {
    await mongoose.model("Book").deleteMany({ userId: this._id });
    await mongoose.model("Review").deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);