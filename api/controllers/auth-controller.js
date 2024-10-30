import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(errorHandler(400, "All field required"));
  }
  if (username.length < 5 || username.length > 20)
    return next(
      errorHandler(401, "username must be between 5 and 20 charectors")
    );
  if (username.includes(" ")) {
    return next(errorHandler(400, "Username cannot contain spaces"));
  }
  if (username !== username.toLowerCase()) {
    return next(errorHandler(400, "username must be in lowercase"));
  }
  if (!username.match(/^[a-zA-Z0-9]+$/)) {
    return next(
      errorHandler(400, "username must contain only letters and numbers")
    );
  }
  try {
    const findUserByUsername = await User.findOne({ username });
    if (findUserByUsername) {
      return next(errorHandler(400, "Username Already Exists"));
    }
    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      return next(errorHandler(400, "Email-Id Already exists "));
    }
    if (password.length < 5)
      return next(
        errorHandler(401, "password should be greater than 5 charectors")
      );

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newuser = new User({ username, email, password: hashedPassword });
    await newuser.save();
    res.status(201).json("user created succesfully");
  } catch (error) {
    next(error); // passing error to error handling middle ware
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const founduser = await User.findOne({ email });
    if (!founduser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, founduser.password);
    if (!validPassword)
      return next(errorHandler(401, "Password or Email is incorrect"));
    const token = jwt.sign({ id: founduser._id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 48 * 60 * 60 * 1000,
    });
    const { password: pass, ...rest } = founduser._doc; // extract password from founduser and rename it as pass, if we only give password there will be 2 const password and become error. for more : https://g.co/bard/share/437c7ffbcb0a
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      });
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const modifiedname =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: modifiedname,
        email: email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      });
      const { password, ...rest } = newUser._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been signed out");
  } catch (error) {
    next(error);
  }
};
