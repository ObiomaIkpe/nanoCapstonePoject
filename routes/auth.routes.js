// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { signUp, loginUser, refreshAccessToken, logoutUser} = require('../controllers/auth.controller');

router.post('/sign-up', signUp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);


module.exports = router;
