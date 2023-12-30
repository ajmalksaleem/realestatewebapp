import { Router } from "express";
import { createListing, deleteListing, updateListing } from "../controllers/listing-controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = Router();

listingRouter.post('/create', verifyUser, createListing)
listingRouter.delete('/delete/:id', verifyUser, deleteListing)
listingRouter.put('/update/:id', verifyUser, updateListing)

export default listingRouter