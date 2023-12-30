import { Link, useLocation } from 'react-router-dom'
import { VscAccount } from "react-icons/vsc";
import { RiListIndefinite } from "react-icons/ri";
import { LuView } from "react-icons/lu";

const ProfileNav = () => {
    const { pathname } = useLocation();

    function linkClasses(type = null) {
        let classes = 'flex gap-1 items-center  h-10 '
        if (type === pathname) {
            classes += 'text-[16px]  bg-gray-200 px-2 text-black '
        }
        return classes;
    }

    return (
        <div className='max-w-xs text-xs mx-auto  mt-7 p-2 text-white rounded-lg  bg-gray-600 h-10 flex gap-2 b justify-around items-center md:text-sm md:max-w-md'>
            <Link to={'/profile'} className={linkClasses('/profile')}>
                <VscAccount />
                Profile
            </Link>
            <Link to={'/create-listing'} className={linkClasses('/create-listing')}>
                <RiListIndefinite />
                Create Listing
            </Link>
            <Link to={'/view-listings'} className={linkClasses('/view-listings')}>
                <LuView />
                Your Listings
            </Link>
        </div>
    )
}

export default ProfileNav
