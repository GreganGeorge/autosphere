import React, { useState,useEffect } from 'react'
import toast from 'react-hot-toast';
const MechanicProfile = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude,setLongitude]=useState(null);
    const [placeName, setPlaceName] = useState('');
    const [data,setData]=useState([]);
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [address,setAddress]=useState('');
    const [about,setAbout]=useState('');
    const [availability,setAvailability]=useState('');
    const getLocation = () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lon);
            getPlaceName(lat, lon);
            },
            (error) => {
                toast.error('Unable to retrieve location. Please ensure location services are enabled.');
            }
        );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    const getPlaceName = async (lat, lon) => {
        const apiKey = '94a2fdd2253d47919cc4f9cc27a10036';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                setPlaceName(data.results[0].formatted);
            } else {
                setPlaceName('Unknown location');
            }
        } catch (error) {
            toast.error('Error fetching place name:', error);
        }
    };
    const getData=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get3?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          setEmail(data[0]?.email);
          setName(data[0]?.username);
          setNumber(data[0]?.phone_number);
          setLatitude(data[0]?.latitude);
          setLongitude(data[0]?.longitude);
          setPlaceName(data[0]?.place);
          setAddress(data[0]?.addr);
          setAbout(data[0]?.about);
          setAvailability(data[0]?.availability);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const update=()=>{
        const id = localStorage.getItem('login_id');
        fetch(`http://localhost:5059/api/User/Put1?id=${id}&username=${name}&phone_number=${number}&latitude=${latitude}&longitude=${longitude}&place=${placeName}&addr=${address}&about=${about}&availability=${availability}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:id,
                username:name,
                phone_number:number,
                latitude:latitude,
                longitude:longitude,
                place:placeName,
                addr:address,
                about:about,
                availability:availability
            })
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                getData();
            },(error)=>{
                toast.error('Failed');
            })
    }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div className='flex justify-center items-center mt-40 mb-60'>
        <div className='w-full max-w-lg'>
            <h2 className="text-3xl font-semibold mb-6 text-center">Mechanic Profile</h2>
            <button onClick={getLocation} className="mb-6 w-full px-4 py-2 text-base font-medium text-white 
            bg-green-600 rounded-md shadow-sm hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Capture Current Location</button>
            {(latitude && longitude) && (<div className="mb-4 text-center">
                {placeName && <p className="font-semibold text-gray-700"><span className='font-bold text-[17px]'>Current Location:</span> {placeName}</p>}
            </div>)}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{email}</p>
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    id="username"
                    type="text"
                    value={name}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="text"
                    value={number}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setNumber(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    value={address}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <select value={availability || ""} onChange={(e)=>setAvailability(e.target.value)} className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                    {!availability && <option value="">Select Availability</option>}
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">About Me</label>
                <textarea rows={6}
                    type="text"
                    value={about}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setAbout(e.target.value)}
                />
            </div>
            <button
                className="w-full px-4 py-2 text-base font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={update}
            >
                Save Changes
            </button>
        </div>
    </div>
  )
}

export default MechanicProfile