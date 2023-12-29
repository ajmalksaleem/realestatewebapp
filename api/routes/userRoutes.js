import { Router } from "express";
import { deleteUser, updateUser, getUserListings } from "../controllers/user-controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const userRoute = Router()

userRoute.post('/update/:id', verifyUser, updateUser)
userRoute.delete('/delete/:id', verifyUser, deleteUser)
userRoute.get('/listings/:id', verifyUser, getUserListings)
export default userRoute;