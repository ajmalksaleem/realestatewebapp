import { Router } from "express";
import { createListing, deleteListing, updateListing, getList } from "../controllers/listing-controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = Router();

listingRouter.post('/create', verifyUser, createListing)
listingRouter.delete('/delete/:id', verifyUser, deleteListing)
listingRouter.put('/update/:id', verifyUser, updateListing)
listingRouter.get('/list/:id', verifyUser, getList)

export default listingRouter