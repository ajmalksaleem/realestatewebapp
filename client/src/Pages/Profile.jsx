import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";

const Profile = () => {
    const fileRef = useRef(null)
    const { currentUser } = useSelector(state => state.user);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setfilePercentage] = useState(0);
    const [fileUploadError, setfileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    console.log(formData);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);                                  //firebase ref not useref
        const uploadTask = uploadBytesResumable(storageRef, file);                   // uploadbyresumable : https://g.co/bard/share/beda9450d63b // other upload methods : https://g.co/bard/share/858a61794973

        uploadTask.on('state_changed',                                                //state_changed is a predefined event listener in Firebase Storage //You attach a listener for the state_changed event using the uploadTask.on('state_changed', ...) or downloadTask.on('state_changed', ...) method.
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;       //Divides the transferred bytes by the total bytes and multiplies by 100 to get a percentage.
                //console.log('progress :' + progress)
                setfilePercentage(Math.round(progress))
            },
            (error) => {
                setfileUploadError(true);
                console.log(error)                                      //Firebase Storage events like state_changed provide a mechanism for handling errors within a specific context, rather than using more general try...catch blocks. 
            },                                                                     // here a number of callbacks connected with 'state-changed' are used , 1st snapshot, 2nd error , 3rd ..etc seperated by commas
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL })
                });
            }
        )
    };




    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className="flex flex-col gap-4">
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="" //When the image is clicked, it calls the click() method on the hidden file input (fileRef.current), effectively opening the file selection dialog.
                    className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center" />
                <p className="text-center text-sm">
                    {fileUploadError ?
                        <span className="text-red-700">Error Image Upload (image must be less than 2mb)</span>
                        : filePercentage > 0 && filePercentage < 100 ? <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
                            : filePercentage === 100 ? <span className="text-green-700">Image Successfully Uploaded</span>
                                : ''}
                </p>
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
