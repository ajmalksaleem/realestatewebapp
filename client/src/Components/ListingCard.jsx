import { Link } from "react-router-dom"
import { MdLocationOn } from 'react-icons/md'

const ListingCard = ({ listing }) => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg duration-300  w-full sm:w-[230px]">
            <Link to={`/listing/${listing._id}`}>
                <img className="h-[220px] sm:h-[180px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    src={listing.ImageUrls[0] || 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85991365-e96f-4806-8877-7a5199029b0a/df9suv8-cd7bb600-f93d-47e9-8cad-c6b70e000866.png/v1/fit/w_733,h_443,q_70,strp/greenary_by_lingshuang33_df9suv8-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDQzIiwicGF0aCI6IlwvZlwvODU5OTEzNjUtZTk2Zi00ODA2LTg4NzctN2E1MTk5MDI5YjBhXC9kZjlzdXY4LWNkN2JiNjAwLWY5M2QtNDdlOS04Y2FkLWM2YjcwZTAwMDg2Ni5wbmciLCJ3aWR0aCI6Ijw9NzMzIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.4ICxYFJFuHT6cgrFcPfPJ-00DcWlFMintsDTrwRGTJc'}
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
