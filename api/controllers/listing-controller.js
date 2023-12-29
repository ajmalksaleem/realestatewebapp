import Listing from '../models/listingModel.js'
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const createListing = await Listing.create(req.body)
        res.status(201).send(createListing)
    } catch (error) {
        next(error)
    }
};

