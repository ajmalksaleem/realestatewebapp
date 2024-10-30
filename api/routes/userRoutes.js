import { Router } from "express";
import { deleteUser, updateUser, getUserListings, getUser } from "../controllers/user-controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const userRoute = Router()

userRoute.post('/update/:id', verifyUser, updateUser)
userRoute.delete('/delete/:id', verifyUser, deleteUser)
userRoute.get('/listings/:id', verifyUser, getUserListings)
userRoute.get('/:id', verifyUser, getUser)
export default userRoute;