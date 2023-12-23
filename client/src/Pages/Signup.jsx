import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'


const Signup = () => {

    const [formData, setformData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState();
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
            setLoading(true)
            const res = await fetch('/api/auth/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
            const data = await res.json()  //The json() method returns a Promise that resolves to the parsed JSON data
            if (data.success === false) {
                setLoading(false)
                setError(data.message);
                return
            }
            setLoading(false)
            setError(null)
            navigate('/sign-in')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }



    };

    // const handleSubmit = async (ev) => {
    //     ev.preventDefault()
    //     const res = await axios.post('/api/auth/signup',
    //         formData)
    //     const data = res.data
    //     console.log(data);
    // }





    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
                <input type="text" placeholder='User Name' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
                <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
                <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
                <button disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>
                    {loading ? 'Loading...' : "Signup"}
                </button>
            </form>
            <div className="flex gap-1 mt-2">
                <p>have an account?</p>
                <Link to={'/sign-in'} className='text-blue-700 hover:underline'>Sign in</Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}

export default Signup



