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

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'Listing not found'))
    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can only delete your own listing'))
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('listing deleted')
    } catch (error) {
        next(error)
    }


};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'Listing not found'))
    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can only delete your own listing'))
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedListin)
    } catch (error) {
        next(error)
    }
}

