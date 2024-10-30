import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listingModel.js";

export const updateUser = async (req, res, next) => {
    try {
      if (req.user.id !== req.params.id)
        return next(errorHandler(401, "You can only update your own account"));
  
      const updateData = {};
  
      if (req.body.username) {
        if (req.body.username.length < 5 || req.body.username.length > 20) {
          return next(
            errorHandler(400, "Username must be between 5 and 20 characters")
          );
        }
        if (req.body.username.includes(" ")) {
          return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
          return next(errorHandler(400, "Username must be in lowercase"));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
          return next(
            errorHandler(400, "Username must contain only letters and numbers")
          );
        }
        const existingUsername = await User.findOne({ username: req.body.username });
        if (existingUsername && existingUsername._id.toString() !== req.user.id) {
          return next(errorHandler(400, "Username Already Exists"));
        }
        updateData.username = req.body.username;
      }
  
      if (req.body.email) {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail && existingEmail._id.toString() !== req.user.id) {
          return next(errorHandler(400, "Email-Id already exists"));
        }
        updateData.email = req.body.email;
      }
  
      if (req.body.password) {
        updateData.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      if (req.body.avatar) {
        updateData.avatar = req.body.avatar;
      }
  
      // Check if any fields are being updated
      if (Object.keys(updateData).length === 0) {
        return next(errorHandler(400, "No updates provided"));
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        $set: updateData,
      }, { new: true });
  
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: req.user.id });
    res.clearCookie("access_token", { path: "/" });
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const userListings = await Listing.find({ userRef: req.params.id });
      if (!userListings) return next(errorHandler(404, "listing not found"));
      res.status(200).json(userListings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only view your own listing"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
