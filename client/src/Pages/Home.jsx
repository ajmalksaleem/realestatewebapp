import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'

import { signInSuccess } from '../redux/user/userSlice'

const Home = () => {
    const dispatch = useDispatch()
    const logout = () => {
        const res = axios.post('/api/auth/logout')
        const data = res.data;
        dispatch(signInSuccess(null))
    }
    return (
        <div>
            Home
            <button onClick={logout}>logout thalkal</button>

        </div>
    )
}

export default Home
