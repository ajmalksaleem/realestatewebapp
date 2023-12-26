import { Router } from "express";
import { deleteUser, updateUser } from "../controllers/user-controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const userRoute = Router()

userRoute.post('/update/:id', verifyUser, updateUser)
userRoute.delete('/delete/:id', verifyUser, deleteUser)

export default userRoute;