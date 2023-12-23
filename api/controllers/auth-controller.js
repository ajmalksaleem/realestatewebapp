import User from "../models/userModel.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newuser = new User({ username, email, password: hashedPassword })
    try {
        await newuser.save()
        res.status(201).json("user created succesfully")
    } catch (error) {
        next(error)    // passing error to error handling middle ware
    }

}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const founduser = await User.findOne({ email })
        if (!founduser) return next(errorHandler(404, 'User not found'))
        const validPassword = bcryptjs.compareSync(password, founduser.password);
        if (!validPassword) return next(errorHandler(401, 'Password or Email is incorrect'));
        const token = jwt.sign({ id: founduser._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, { httpOnly: true, maxAge: 48 * 60 * 60 * 1000 });
        const { password: pass, ...rest } = founduser._doc   // extract password from founduser and rename it as pass, if we only give password there will be 2 const password and become error. for more : https://g.co/bard/share/437c7ffbcb0a 
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}

