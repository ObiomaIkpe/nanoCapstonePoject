const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true 
  },
  userName: {
    type: String,
    required: true, 
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

// Virtual field to relate user to their blog posts
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'userId'
});

// Ensure virtuals are included in toJSON and toObject
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('User', userSchema)
