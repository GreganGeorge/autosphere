import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import mech from '../assets/man-with-wrench-his-hand.png'

const Alert = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [placeName, setPlaceName] = useState('');
    const [mechanics, setMechanics] = useState([]);
    const [radius, setRadius] = useState(0);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lon);
                    getPlaceName(lat, lon);
                    fetchMechanics(lat, lon, radius);
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
                updatePlaceName(data.results[0].formatted);
            } else {
                setPlaceName('Unknown location');
            }
        } catch (error) {
            toast.error('Error fetching place name:', error);
        }
    };
    const updatePlaceName=(place)=>{
        const userid=localStorage.getItem('login_id');
        fetch(`http://localhost:5059/api/User/Put2?place=${place}&userid=${userid}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                userid:userid,
                place:place
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log("Updated Location!");
        },(error)=>{
            toast.error("Error");
        })
    }

    const fetchMechanics = async (lat, lon, radius) => {
        try {
            const response = await fetch(`http://localhost:5059/api/Mechanic/GetWithinRadius?lat=${lat}&lon=${lon}&radius=${radius}`);
            const data = await response.json();
            const mechanicsWithTravelTime = await Promise.all(data.map(async (mechanic) => {
              const travelTime = await getTravelTime(lat, lon, mechanic.latitude, mechanic.longitude);
              return { ...mechanic, travelTime };
          }));
            setMechanics(mechanicsWithTravelTime);
        } catch (error) {
            toast.error('Error fetching mechanics:', error);
        }
    };
    const getTravelTime = async (lat1, lon1, lat2, lon2) => {
      const openRouteServiceApiKey = '5b3ce3597851110001cf624845fe0730d0214eafa8ac6866c9869311';
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceApiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`;
  
      try {
          const response = await fetch(url);
          const data = await response.json();
  
          if (
              data.features &&
              data.features.length > 0 &&
              data.features[0].properties &&
              data.features[0].properties.summary
          ) {
              return data.features[0].properties.summary.duration / 60;
          } else {
              console.error('No valid route summary found in response:', data);
              return null;
          }
      } catch (error) {
          console.error('Error fetching travel time:', error);
          return null;
      }
  };
  
  

    return (
        <div className='flex justify-center items-center mt-40 mb-60'>
            <div className='w-full max-w-lg'>
                <div className='text-4xl mb-6 text-center flex gap-2 justify-center items-center'>
                    <p className='text-gray-700'>ALERT<span className='text-gray-700 font-medium'> MECHANIC</span></p>
                    <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                </div>
                <img src={mech} height={300} width={300} className='ml-32'/>
                <button onClick={getLocation} className="mb-6 w-full px-4 py-2 text-base font-medium text-white 
                    bg-green-600 rounded-md shadow-sm hover:bg-green-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Capture Current Location
                </button>
                {(latitude && longitude) && (
                    <div className="mb-4 text-center">
                        {placeName && <p className="font-semibold text-gray-700"><span className='font-bold text-[17px]'>Current Location:</span> {placeName}</p>}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Search Radius (km)</label>
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => {
                            const newRadius = e.target.value;
                            setRadius(newRadius);
                            if (latitude && longitude && newRadius>0) {
                                fetchMechanics(latitude, longitude, newRadius); 
                            }
                        }}
                        className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <h3 className="text-lg font-semibold text-center mb-4">Nearby Mechanics:</h3>
                {(mechanics.length > 0 && radius>0) ? (
                    <ul className="list-none">
                        {mechanics.map((mechanic) => (
                            <li key={mechanic.id} className="border p-4 mb-4 flex justify-between items-center">
                              <div>
                                <p className='text-[18px] flex items-center gap-0.5'>{mechanic.username}<img src={verified} height={25} width={25}/></p>
                                <p className='text-gray-700'>Phone: {mechanic.phone_number}</p>
                                {mechanic.travelTime && (
                                    <p className='text-gray-600'>Travel Time: {Math.round(mechanic.travelTime)} min</p>
                                )}
                              </div>
                                <Link to={`/mechanic/${mechanic.id}`} state={{travelTime:Math.round(mechanic.travelTime)}} type="button" className=" text-white mt-1 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View</Link>
                            </li>
                        ))}
                    </ul>
                ) : radius<=0 ? <p className="text-gray-500 text-center">Type radius</p> :(
                    <p className="text-gray-500 text-center">No mechanics found within {radius} km.</p>
                )}
            </div>
        </div>
    );
};

export default Alert;
