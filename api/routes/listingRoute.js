import { Router } from "express";
import { createListing } from "../controllers/listing-controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = Router();

listingRouter.post('/create', verifyUser, createListing)


export default listingRouter