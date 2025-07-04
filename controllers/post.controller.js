const slugify = require('slugify');
const Post = require('../models/post.model');

const createPost = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newPost = new Post({
      userId: req.user.id,        // comes from verifyAdmin middleware
      title,
      content,
      image,
      category
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post.' });
  }
};




const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 10;   
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('comments')
      .exec();

    res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      posts,
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Allowed fields only
    const allowedUpdates = ['title', 'content', 'image', 'category'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post.' });
    }

    // Regenerate slug if title is changed
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error while updating post.' });
  }
};

module.exports = updatePost;




const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { id: userId, isAdmin } = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Allow if user owns the post OR is an admin
    if (post.userId.toString() !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = { createPost, getAllPosts, updatePost, deletePost };
