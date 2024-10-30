import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth'
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

            const res = await axios.post('/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            })
            const data = res.data;
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log("no google", error)
        }
    }

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="bg-red-700 text-white p-3 rounded-lg uppercase 
            flex items-center justify-center gap-2 hover:opacity-85">
            <div className="text-xl"><FaGoogle /></div>
            <span>continue with google</span>
        </button>
    )
}

export default OAuth
