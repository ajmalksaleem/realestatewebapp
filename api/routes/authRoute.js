import { Router } from "express";
import { signin, signup } from "../controllers/auth-controller.js";

const authRoute = Router();

authRoute.post('/signup', signup);
authRoute.post('/signin', signin)

export default authRoute;