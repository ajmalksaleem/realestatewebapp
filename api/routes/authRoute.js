import { Router } from "express";
import { googleSignIn, signin, signup } from "../controllers/auth-controller.js";

const authRoute = Router();

authRoute.post('/signup', signup);
authRoute.post('/signin', signin)
authRoute.post('/google', googleSignIn);
authRoute.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

export default authRoute;