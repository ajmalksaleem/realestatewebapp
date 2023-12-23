import { useSelector } from "react-redux"
import { useRef } from "react";

const Profile = () => {
    const fileRef = useRef(null)
    const { currentUser } = useSelector(state => state.user);
    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className="flex flex-col gap-4">
                <input type="file" ref={fileRef} hidden accept="image/*" />
                <img onClick={() => fileRef.current.click()} src={currentUser.avatar} alt="" //When the image is clicked, it calls the click() method on the hidden file input (fileRef.current), effectively opening the file selection dialog.
                    className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center" />
                <input id="username" type="text" placeholder="Username" className="border p-4 rounded-lg" />
                <input id="email" type="text" placeholder="Email" className="border p-4 rounded-lg" />
                <input id="password" type="text" placeholder="Password" className="border p-4 rounded-lg" />
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85">Update</button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer">Delete Account</span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
        </div>
    )
}

export default Profile
