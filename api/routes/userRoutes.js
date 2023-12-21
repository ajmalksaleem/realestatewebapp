import { Router } from "express";
import { test } from "../controllers/user-controller.js";


const userRoute = Router()

userRoute.get('/', test)

export default userRoute;