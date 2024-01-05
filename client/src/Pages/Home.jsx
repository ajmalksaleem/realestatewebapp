import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle'
import ListingCard from "../Components/ListingCard";

const Home = () => {
    SwiperCore.use([Navigation, Pagination, Autoplay]);
    const [offerListing, setofferListing] = useState([]);
    const [saleListing, setsaleListing] = useState([]);
    const [rentListing, setrentListing] = useState([])

    useEffect(() => {
        const fetchOfferListing = async () => {
            try {
                const res = await axios.get('/api/listing/searchlistings?offer=true&limit=4');
                const { data } = res;
                setofferListing(data)
                fetchSaleListing()
                fetchRentListing()
            } catch (error) {
                console.log(error)
            }
        }
        const fetchSaleListing = async () => {
            try {
                const res = await axios.get('/api/listing/searchlistings?type=sale&limit=4');
                const { data } = res;
                setsaleListing(data)
            } catch (error) {
                console.log(error)
            }
        }
        const fetchRentListing = async () => {
            try {
                const res = await axios.get('/api/listing/searchlistings?type=rent&limit=4');
                const { data } = res;
                setrentListing(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchOfferListing()
    }, []);
    console.log(offerListing)
    return (
        <div>
            {/* top  */}
            <div className="flex flex-col gap-5 pt-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl ">
                    Find your next <span className="text-slate-500">perfect</span> <br />
                    Place with ease
                </h1 >
                <div className="text-gray-400 text-xs sm:text-sm ">
                    Ajmale's Estate is the best place to find your next perfect place to live
                    <br /> We have a wide range of properties for you to choose from.
                </div>
                <Link className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
                    to={`/search`}>Explore Now...</Link>
            </div>
            {/* swiper */}
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}

                className='my-10'>
                {offerListing && offerListing.length > 0 && offerListing.map((offerlisting) => (
                    <SwiperSlide key={offerlisting._id}>
                        <div className='h-[200px] md:h-[280px] lg:h-[350px]' style={{
                            background: `url(${offerlisting.ImageUrls[0]})
                         center no-repeat`, backgroundSize: 'cover'
                        }}></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* listing result for offer sale and rent */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10  ">
                {offerListing && offerListing.length > 0 && (
                    <div className="">
                        <div className="my-4">
                            <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                            <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more offers</Link>
                        </div>
                        <div className="flex flex-wrap gap-5  sm:gap-8 ">
                            {offerListing.map((offerlist) => (
                                <ListingCard key={offerlist._id} listing={offerlist} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10  ">
                {saleListing && saleListing.length > 0 && (
                    <div className="">
                        <div className="my-4">
                            <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                            <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=sale'}>Show more places for sale</Link>
                        </div>
                        <div className="flex flex-wrap gap-5  sm:gap-8 ">
                            {saleListing.map((salelist) => (
                                <ListingCard key={salelist._id} listing={salelist} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10  ">
                {rentListing && rentListing.length > 0 && (
                    <div className="">
                        <div className="my-4">
                            <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
                            <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=rent'}>Show more places for rent</Link>
                        </div>
                        <div className="flex flex-wrap gap-5  sm:gap-8 ">
                            {rentListing.map((rentlist) => (
                                <ListingCard key={rentlist._id} listing={rentlist} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
