const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser } = require('../controllers/user.controller');
const {verifyAdmin, verifyAccessToken} = require('../middlewares/protect');
const multer = require('../middlewares/multer')

router.get('/users', verifyAdmin, getAllUsers);
router.patch('/:id', verifyAccessToken, multer.single('profilePicture'), updateUser);


module.exports = router;