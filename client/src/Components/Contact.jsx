import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Contact = ({ listingData }) => {

    const [landlord, setlandlord] = useState(null);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const [message, setmessage] = useState('');

    useEffect(() => {

        const fetchLandlord = async () => {
            try {
                setloading(true)
                const res = await axios.get(`/api/user/${listingData.userRef}`)
                const { data } = res;
                setlandlord(data)
                setloading(false)
            } catch (error) {
                if (error.response) {
                    seterror(error.response.data.message);
                    setloading(false)
                } else {
                    seterror(error.message);
                    setloading(false)
                }
            }
        }
        fetchLandlord()
    }, []);

    const onChange = (e) => {
        setmessage(e.target.value)
    };



    return (
        <>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}

            {landlord && !error && !loading && (
                <div className="">
                    <p>Contact <span className="font-semibold text-red-500">{landlord.username}</span> for
                        <span className="font-semibold "> {listingData.name}</span></p>
                    <textarea value={message} onChange={onChange} placeholder="Enter your Message here.." name="message" id="message" rows="3"
                        className="w-full p-2 mt-1 border mb-3" ></textarea>

                    <Link to={`mailto:${landlord.email}?subject=Regarding${listingData.name}&body=${message}`}
                        className='bg-slate-700  text-white p-3 rounded-lg hover:opacity-85 uppercase ml-1'>
                        Send Message</Link>

                </div>
            )}


        </>
    )
}

export default Contact
