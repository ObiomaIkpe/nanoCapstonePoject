const User = require('../models/user.model');
const cloudinary = require("../utils/cloudinary")
const fs = require('fs');
const CustomError = require('../utils/customError');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshToken') // Exclude sensitive fields
      .populate('posts'); // Optionally include posts

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateUser = async (req, res) => {
  try{
    const userId = req.params.id;

    // ✅ Allow user or admin
    if (req.user.id !== userId && !req.user.isAdmin) {
      throw new CustomError(403, 'You are not authorized to update this user');
    }

    const updates = {};

    if(req.body.userName) {
      updates.userName = req.body.userName;
    }
    
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures'
      });

      updates.profilePicture = result.secure_url;

      fs.unlinkSync(req.file.path)
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });


  }
  catch(error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllUsers, updateUser };
