import { Link } from "react-router-dom"
import { MdLocationOn } from 'react-icons/md'

const ListingCard = ({ listing }) => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg duration-300  w-full sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    src={listing.ImageUrls[0]}
                    alt="cover image" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="text-lg font-semibold truncate">{listing.name}</p>
                    <div className="flex  items-center gap-2 px-2">
                        <MdLocationOn className="h-5 w-5 text-green-700" />
                        <p className="whitespace-nowrap truncate text-sm ">{listing.address}</p>
                    </div>
                    <p className="text-sm line-clamp-2">{listing.description}</p>
                    <p className="mt-2 font-semibold">
                        ${' '}
                        {listing.offer ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <div className="flex gap-3 font-semibold">
                        <p>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds`
                                : `${listing.bedrooms} bed`
                            }
                        </p>
                        <p>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms`
                                : `${listing.bathrooms} bathroom`
                            }
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingCard
