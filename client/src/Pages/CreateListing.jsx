import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';



const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setimageUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [photoPercentage, setphotoPercentage] = useState(0);
    const [formData, setformData] = useState({
        ImageUrls: [],
    });
    console.log(formData);
    console.log(photoPercentage);

    const handleImageSubmit = () => {
        setUploading(true);
        setimageUploadError('');
        if (files.length <= 0) return setimageUploadError('No images have been selected for upload!'), setUploading(false)
        if (files.length > 6) return setimageUploadError('The maximum allowed number of uploads is six images'), setUploading(false)
        const promises = []
        for (let i = 0; i < files.length; i++) {
            promises.push(storeImage(files[i]))
        }
        Promise.all(promises).then((urls) => {
            setformData({ ...formData, ImageUrls: formData.ImageUrls.concat(urls) });         //https://g.co/bard/share/b854212a9bb1
            setUploading(false)
        })
            .catch((err) => {
                setimageUploadError("Image upload failed (2 mb max per image)")
                setUploading(false)
            })
    };
    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setphotoPercentage(Math.round(progress))

                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        })
    };

    const handleImageRemove = (index) => {
        setformData({ ...formData, ImageUrls: formData.ImageUrls.filter((url, i) => i !== index) })
    }

    return (
        <main className='p-6 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center mb-7 mt-4'>Create a listing</h1>
            <form className='flex flex-col  md:flex-row gap-6'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name..' className='p-3 border' id='name' maxLength='62' minLength='5' required />
                    <textarea type="text" placeholder='Description' className='p-3' id='description' required />
                    <input type="text" placeholder='Address..' className='p-3 border' id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-4 border' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-4 border' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-4 border' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-4 border' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-4 border' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 justify-center  gap-7'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='1' max='10' className='p-3 w-16 border border-gray-300' />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='1' max='10' className='p-3 w-16 border border-gray-300' />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='1' max='10' className='p-3 w-16 border border-gray-300' />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='1' max='10' className='p-3 w-16 border border-gray-300' />
                            <div className='flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>


                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 ml-2 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-700'> The first image will be the cover</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={e => setFiles(e.target.files)} type="file" id="" accept='image/*' multiple className='p-3 w-full border-gray-300 border' />
                        <button disabled={uploading} onClick={handleImageSubmit} type='button'
                            className='p-3 text-green-700 border border-green-700 uppercase
                             hover:bg-green-700 hover:text-white disabled:bg-green-400 disabled:border-green-400 flex items-center gap-2 disabled:text-white'>
                            {uploading ? "UPLOADING" : "UPLOAD"}
                            {uploading && <div className="spinner" />}</button>
                    </div>
                    <p className='text-red-700 text-sm ml-2'>{imageUploadError}</p>
                    {
                        formData.ImageUrls.length > 0 && formData.ImageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-2 border items-center">
                                <img src={url} alt="nvn" className='w-20 h-20 object-contain rounded-lg' />
                                <button onClick={(ev) => handleImageRemove(index)} className='bg-gray-500 p-3 rounded-lg text-white hover:bg-red-700' type='button'>DELETE</button>
                            </div>
                        ))
                    }
                    {uploading && (
                        <div className="h-1 rounded-full overflow-hidden max-w-100 bg-gray-200">
                            <div
                                className={`h-full bg-green-500 rounded-full   ${photoPercentage >= 100 ? 'animate-pulse' : ''}`}
                                style={{ width: `${photoPercentage}%` }}
                            />
                        </div>
                    )

                    }

                    <button className='p-3 bg-gray-700 text-white uppercase rounded-lg hover:opacity-85 disabled:bg-red-800'>Create listing</button>
                </div>

            </form>
        </main>
    )
}


export default CreateListing
