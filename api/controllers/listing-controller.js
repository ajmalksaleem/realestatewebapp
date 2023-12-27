import Listing from '../models/listingModel.js'


export const createListing = async (req, res, next) => {
    try {
        const createListing = await Listing.create(req.body)
        res.status(201).send(createListing)
    } catch (error) {
        next(error)
    }
}