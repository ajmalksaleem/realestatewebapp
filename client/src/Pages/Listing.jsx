import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle'
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { useSelector } from 'react-redux'
import Contact from '../Components/Contact';

const Listing = () => {
    const listingId = useParams().id;
    SwiperCore.use([Navigation, Pagination, Autoplay]);
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()

    const [listingData, setlistingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setcontact] = useState(false);
    const [navigates, setnavigates] = useState(false);

    useEffect(() => {
        const listData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/listing/list/${listingId}`);
                const { data } = res;
                setlistingData(data)
                setError(false)
                setLoading(false)
                return
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                    setLoading(false)
                } else {
                    setError(error.message);
                    setLoading(false)
                }
            }
        }
        listData();
    }, [listingId]);
    console.log(listingData);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
            {listingData && !error && !loading && (
                <>
                    <Swiper spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 0,
                            }
                        }}
                        className=''>
                        {listingData.ImageUrls.map(url => (
                            <SwiperSlide key={url}>
                                <div className='h-[200px] md:h-[280px] lg:h-[350px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[16%] right-[1%] z-10 bg-white justify-center p-2 rounded-full items-center cursor-pointer'>
                        <IoShareSocialSharp
                            className='text-lg'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true)
                                setTimeout(() => {
                                    setCopied(false)
                                }, 1000);
                            }} />
                    </div>
                    {copied && (
                        <p className='fixed top-[16.6%] right-[11%] md:right-[6%] lg:right-[5%] bg-slate-100 px-2 py-0.5 rounded-md z-10 '>Link Copied</p>
                    )}
                    <div className='flex flex-col my-7 max-w-6xl mx-auto p-3 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listingData.name} - ${''}
                            {listingData.offer ? listingData.discountPrice.toLocaleString('en-US')   //It formats the price number according to US conventions, which typically includes:Using commas as thousands separators (e.g., 1,234.56).Placing two decimal places for currencies (e.g., $12.34).
                                : listingData.regularPrice.toLocaleString('en-US')}
                            {listingData.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-4 gap-2 text-sm text-slate-600'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listingData.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 max-w-[200px] p-1 w-full text-center text-white rounded-md'>
                                {listingData.type === 'rent' ? 'For Rent' : "For Sale"}
                            </p>
                            {listingData.offer && (
                                <p className='bg-green-900 max-w-[200px] p-1 w-full text-center text-white rounded-md'>
                                    Offer -   ${+listingData.regularPrice - +listingData.discountPrice} <span className='text-xs'>off</span>
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'> <span className='font-semibold text-black'>Description - </span>{listingData.description}</p>
                        <ul className='text-green-900 font-semibold text-sm items-center flex flex-wrap gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 m-1 whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listingData.bedrooms > 1 ? `${listingData.bedrooms} Beds` : `${listingData.bedrooms} Bed`}
                            </li>
                            <li className='flex items-center gap-1 m-1 whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listingData.bathrooms > 1 ? `${listingData.bathrooms} Bathrooms` : `${listingData.bathrooms} Bathroom`}
                            </li>
                            <li className='flex items-center gap-2 m-1 whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listingData.parking ? 'Parking' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-2 m-1 whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listingData.furnished ? 'Furnished' : "Unfurnished"}
                            </li>
                        </ul>
                        {currentUser ? listingData.userRef !== currentUser._id && !contact && (

                            <button onClick={() => setcontact(true)} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-85 mt-5 uppercase '>Contact Landlort</button>
                        ) : <button onClick={() => setnavigates(true)} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-85 mt-5 uppercase '>Contact Landlord</button>}
                        {contact && (
                            <Contact listingData={listingData} />
                        )}
                        {navigates && (
                            navigate('/sign-in')
                        )}
                    </div>
                </>
            )}
        </main>
    )
}

export default Listing;