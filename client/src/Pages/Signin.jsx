import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';


const Signin = () => {

    const [formData, setformData] = useState({});
    const { loading, error } = useSelector((state) => state.user)  //error and loading are used below html code
    const navigate = useNavigate();

    const handleChange = (ev) => {
        setformData({
            ...formData, [ev.target.id]: ev.target.value
        });
    }
    console.log(formData);

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        try {
            //setLoading(false)
            useDispatch(signInStart())
            const res = await fetch('/api/auth/signin',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
            const data = await res.json()  //The json() method returns a Promise that resolves to the parsed JSON data
            if (data.success === false) {
                // setLoading(false)
                // setError(data.message);
                useDispatch(signInFailure(data.message))
                return
            }
            // setLoading(false)
            // setError(null)
            useDispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            // setLoading(false)
            // setError(error.message)
            useDispatch(signInFailure(error.message))
        }



    };


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
                <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
                <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
                <button disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>
                    {loading ? 'Loading...' : "Sign In"}
                </button>
            </form>
            <div className="flex gap-1 mt-2">
                <p>havnt yet registered?</p>
                <Link to={'/sign-up'} className='text-blue-700 hover:underline'>Sign up</Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}

export default Signin