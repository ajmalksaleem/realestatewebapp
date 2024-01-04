import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { get } from 'mongoose'

const Header = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [searchTerm, setsearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlSearchTerm = urlParams.get('searchTerm')
        if (urlSearchTerm) {
            setsearchTerm(urlSearchTerm)
        }
    }, [location.search]);

    return (
        <header className='bg-slate-200 '>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500 pr-2'>AJMALE'S</span>
                        <span className='text-slate-700'>ESTATE</span>
                    </h1>
                </Link>
                <form onSubmit={handleSearchSubmit}
                    className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type="text" placeholder='Search..'
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                        className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button >
                        <FaSearch className='text-slate-500' />
                    </button>
                </form>
                <ul className='flex gap-4 text-slate-700 '>
                    <Link to={'/'} className='hidden sm:inline hover:underline'>Home</Link>
                    <Link to={'/about'} className='hidden sm:inline hover:underline'>About</Link>
                    {currentUser ? (
                        <Link to={'/profile'}><img src={currentUser.avatar} alt="img" className='rounded-full h-7 w-7 object-cover' /></Link>
                    ) : <Link to={'/sign-in'} className='hover:underline'>Sign in</Link>}

                </ul>
            </div>
        </header>
    )
}

export default Header
