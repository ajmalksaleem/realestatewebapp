import axios from 'axios'
import ProfileNav from '../Components/ProfileNav'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserListing = () => {
    const { currentUser } = useSelector(state => state.user)
    const [userListings, setuserListings] = useState([]);

    useEffect(() => {
        const getUserListings = async () => {
            const res = await axios.get(`api/user/listings/${currentUser._id}`)
            const { data } = res;
            setuserListings(data);
        };
        getUserListings();
    }, []);

    const handleListingDelete = async (id) => {
        try {
            toast.dismiss()
            const res = await axios.delete(`/api/listing/delete/${id}`)
            const data = res.data;
            toast.success('Listing Deleted')
            setuserListings((prev) => prev.filter((listing) => listing._id !== id))
        } catch (error) {
            if (error.response) {
                // Custom error with status code
                console.log(error.response.data.message)
            } else {
                // Network error or other issue
                console.log(error.message);
            }
        }
    };


    return (
        <>
            <div className='max-w-lg mx-auto'>
                <ProfileNav />
            </div>
            <div className='max-w-lg mx-auto my-4'>
                <h1 className='text-3xl font-semibold text-center my-7'>Your Listings</h1>
                {userListings.length > 0 ? userListings.map((userlist) => (
                    <div className='border border-gray-700 rounded-lg flex gap-3 mb-2 p-3 items-center mx-6 md:mx-1 justify-between' key={userlist._id}>
                        <Link to={`/listing/${userlist._id}`}>
                            <img src={userlist.ImageUrls[0]} className='h-16 w-16 object-cover' alt="Listing cover" />
                        </Link>
                        <Link className='flex-1 font-semibold  hover:underline truncate' to={`/listing/${userlist._id}`}>
                            <p>{userlist.name}</p>
                        </Link>
                        <div className='flex flex-col'>
                            <button onClick={() => handleListingDelete(userlist._id)} className='hover:text-red-700 '>DELETE</button>
                            <button className='hover:text-green-700 '>EDIT</button>
                        </div>
                    </div>
                ))
                    : <p className='text-center text-lg'>No Listings found !!!</p>}
            </div>

        </>
    )
}

export default UserListing