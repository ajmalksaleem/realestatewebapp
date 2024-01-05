import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import ListingCard from "../Components/ListingCard";

const SearchPage = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false);
    const [listings, setlistings] = useState([]);
    const [showMore, setshowMore] = useState(false);
    const [sidebarData, setsidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    });

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setsidebarData({ ...sidebarData, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setsidebarData({ ...sidebarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setsidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt'
            const order = e.target.value.split('_')[1] || 'desc'
            setsidebarData({ ...sidebarData, sort, order })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const urlSearchTerm = urlParams.get('searchTerm')
        const urltype = urlParams.get('type')
        const urlparking = urlParams.get('parking')
        const urloffer = urlParams.get('offer')
        const urlfurnished = urlParams.get('furnished')
        const urlsort = urlParams.get('sort')
        const urlorder = urlParams.get('order')
        if (urlSearchTerm || urltype || urlparking || urloffer || urlfurnished || urlsort || urlorder) {
            setsidebarData({
                searchTerm: urlSearchTerm || '',
                type: urltype || 'all',
                parking: urlparking === 'true' ? true : false,
                furnished: urlfurnished === 'true' ? true : false,
                offer: urloffer === 'true' ? true : false,
                sort: urlsort || 'createdAT',
                order: urlorder || 'desc'
            })
        }
        const fetchListing = async () => {
            setloading(true)
            try {
                const searchQuery = urlParams.toString()
                const res = await axios.get(`/api/listing/searchlistings?${searchQuery}`)
                const { data } = res;
                if (data.length > 8) {
                    setshowMore(true);
                } else {
                    setshowMore(false);
                }
                setlistings(data);
                setloading(false)
            } catch (error) {
                console.log(error)
            }

        };
        fetchListing()
    }, [location.search]);

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await axios.get(`api/listing/searchlistings?${searchQuery}`)
        const { data } = res;
        if (data.length < 9) {
            setshowMore(false);
        }
        setlistings([...listings, ...data])
    }

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen ">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap font-semibold">Search Term : </span>
                        <input type="text" id="searchTerm" placeholder="Search..." className="p-3 border w-full"
                            value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="font-semibold">Type :</span>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.type === 'all'}
                                type="checkbox" id="all" className="w-4 mt-0.5" />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.type === 'rent'}
                                type="checkbox" id="rent" className="w-4 mt-0.5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.type === 'sale'}
                                type="checkbox" id="sale" className="w-4 mt-0.5" />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.offer}
                                type="checkbox" id="offer" className="w-4 mt-0.5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="font-semibold">Aminities :</span>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.parking}
                                type="checkbox" id="parking" className="w-4 mt-0.5" />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-1 ">
                            <input onChange={handleChange} checked={sidebarData.furnished}
                                type="checkbox" id="furnished" className="w-4 mt-0.5" />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className=" flex items-center gap-4">
                        <label className="font-semibold">Sort : </label>
                        <select onChange={handleChange} defaultValue={'createdAt_desc'}
                            className="outline-none p-2 rounded-lg border" id="sort_order">
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'createdAt_desc'}>latest</option>
                            <option value={'createdAt_asc'}>oldest</option>
                        </select>
                    </div>
                    <button className="bg-gray-700 rounded-lg p-3 text-white hover:opacity-80">SEARCH</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="font-semibold text-3xl p-3 mt-3">Search Results</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-center">No Results found!</p>
                    )}
                    {loading && (
                        <p className="text-xl text-center w-full">Loading...</p>
                    )}
                    {!loading && listings.length > 0 && listings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}

                </div>
                {showMore && (
                    <button onClick={onShowMoreClick} className="hover:underline text-green-600 pb-6 w-full text-center">
                        Show more</button>
                )}
            </div>
        </div>
    )
}

export default SearchPage
