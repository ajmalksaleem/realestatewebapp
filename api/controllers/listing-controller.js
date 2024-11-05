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
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
};

export const getList = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return next(errorHandler(404, 'Listing not found'))
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }                         //Find users with ages 25, 30, or 35: db.users.find({ age: { $in: [25, 30, 35] } })
        };
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        };
        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] }
        };
        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['rent', 'sale'] }
        };
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc'
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },  // regex for searching everywhere inside name, each word are matched // $options : i means dont care if they are uppercase or lower case
            offer, furnished, parking, type
        }).sort({ [sort]: order }
        ).limit(limit)
            .skip(startIndex)
        return res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
}

