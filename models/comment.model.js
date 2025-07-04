const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Auto-populate commenter info (optional)
commentSchema.pre(/^find/, function(next) {
  this.populate({ path: 'userId', select: 'userName profilePicture' });
  next();
});

module.exports = mongoose.model('Comment', commentSchema);