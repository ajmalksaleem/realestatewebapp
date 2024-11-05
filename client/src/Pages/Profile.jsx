import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaCameraRetro } from "react-icons/fa";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ProfileNav from "../Components/ProfileNav";

const Profile = () => {
  const fileRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePercentage, setfilePercentage] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateerror, setupdateerror] = useState(null);

  useEffect(() => {
    if (file) {
      setfileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName); 
    const uploadTask = uploadBytesResumable(storageRef, file); 

    uploadTask.on(
      "state_changed", //state_changed is a predefined event listener in Firebase Storage //You attach a listener for the state_changed event using the uploadTask.on('state_changed', ...) or downloadTask.on('state_changed', ...) method.
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //Divides the transferred bytes by the total bytes and multiplies by 100 to get a percentage.
        //console.log('progress :' + progress)
        setfilePercentage(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
        console.log(error); //Firebase Storage events like state_changed provide a mechanism for handling errors within a specific context, rather than using more general try...catch blocks.
      }, // here a number of callbacks connected with 'state-changed' are used , 1st snapshot, 2nd error , 3rd ..etc seperated by commas
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (ev) => {
    setFormData({
      ...formData,
      [ev.target.id]: ev.target.value,
    });
  };

  const handleUpdate = async (ev) => {
    ev.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.dismiss();
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        setupdateerror(error);
        return;
      }
      toast.dismiss();
      dispatch(updateUserSuccess(data));
      toast.success("User updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess());
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto">
        <ProfileNav />
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <div className="relative self-center">
            <img
              src={formData.avatar || currentUser.avatar}
              alt="" //When the image is clicked, it calls the click() method on the hidden file input (fileRef.current), effectively opening the file selection dialog.
              className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center"
            />
            <div
              onClick={() => fileRef.current.click()}
              className="absolute inset-0 rounded-full mt-2 opacity-0 transition-opacity duration-300 bg-black bg-opacity-50 hover:opacity-100"
            >
              <FaCameraRetro className="w-6 h-6 text-white mx-auto my-9 " />
            </div>
          </div>
          <p className="text-center text-sm">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload (image must be less than 2mb)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-700">
                Image Successfully Uploaded
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="border p-4 rounded-lg"
          />
          <input
            id="email"
            defaultValue={currentUser.email}
            type="text"
            onChange={handleChange}
            placeholder="Email"
            className="border p-4 rounded-lg"
          />
          <input
            id="password"
            type="text"
            placeholder="Password"
            onChange={handleChange}
            className="border p-4 rounded-lg"
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85"
          >
            {loading ? "Loading" : "Update"}
          </button>
        </form>
        <div>
          {error && <p className="text-red-500 text-sm">{updateerror}</p>}
        </div>

        <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignout} className="text-red-700 cursor-pointer">
            Sign Out
          </span>
        </div>
      </div>
    </>
  );
};

export default Profile;
