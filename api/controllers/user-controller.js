import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import Listing from '../models/listingModel.js'

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"));
    const checkUser = await User.findOne({ email: req.body.email })
    // console.log(checkUser && checkUser._id + "hello" + req.user.id)
    if (checkUser && checkUser._id.toString() !== req.user.id.toString()) return next(errorHandler(401, "email address already exists"));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true }
        )
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"));
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: req.user.id })
        res.clearCookie('access_token', { path: '/' });
        res.status(200).json('User has been deleted');

    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const userListings = await Listing.find({ userRef: req.params.id })
            if (!userListings) return next(errorHandler(404, "listing not found"))
            res.status(200).json(userListings)
        }
        catch (error) {
            next(error);
        }
    } else { return next(errorHandler(401, "you can only view your own listing")) }



}