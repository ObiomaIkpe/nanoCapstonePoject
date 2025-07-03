const mongoose = require('mongoose')
const slugify = require("slugify")


const postSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    content: {
        type: String,
        required: true
        },
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    },
    category: {
        type: String,
        enum: ['Technology', 'Health', 'Travel', 'Finance', 'Others'],
        default: 'Others'
    },
    slug: {
        type: String
    }
}, {timestamps: true})

postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'userId', select: 'userName email' });
  next();
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId', // Assuming your Comment model uses postId
});

postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Enable virtuals
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);