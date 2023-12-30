import { Router } from "express";
import { createListing, deleteListing } from "../controllers/listing-controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = Router();

listingRouter.post('/create', verifyUser, createListing)
listingRouter.delete('/delete/:id', verifyUser, deleteListing)

export default listingRouter