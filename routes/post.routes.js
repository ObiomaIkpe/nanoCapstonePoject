const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, updatePost, deletePost } = require('../controllers/post.controller');
const { verifyAdmin } = require('../middlewares/protect');

router.post('/create-post', verifyAdmin, createPost);
router.get('/all-posts', verifyAdmin, getAllPosts);
router.put('/posts/:id', verifyAdmin, updatePost);
router.delete('/posts/:id', verifyAdmin, deletePost);

module.exports = router;
