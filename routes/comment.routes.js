const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByUser,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require('../controllers/comment.controller');
const {verifyAccessToken} = require('../middlewares/protect')

// Routes
router.post('/', verifyAccessToken, createComment);
router.get('/post/:postId', getCommentsByPost);
router.get('/user/:userId', getCommentsByUser);
router.patch('/:commentId', verifyAccessToken, updateComment);
router.delete('/:commentId', verifyAccessToken, deleteComment);

module.exports = router;
