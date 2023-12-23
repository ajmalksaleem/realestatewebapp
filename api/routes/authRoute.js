import { Router } from "express";
import { googleSignIn, signin, signup } from "../controllers/auth-controller.js";

const authRoute = Router();

authRoute.post('/signup', signup);
authRoute.post('/signin', signin)
authRoute.post('/google', googleSignIn);

export default authRoute;