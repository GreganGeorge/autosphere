import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'

const CarWashSearch = () => {
    const [name,setName]=useState('');
    const [data,setData]=useState([]);
    const [filteredData,setFilteredData]=useState([]);
    const [place,setPlace]=useState('');
    const [loc,setLoc]=useState('');
    const [services,setServices]=useState([]);
    const [selectedTypes,setSelectedTypes]=useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [selectedRating,setSelectedRating]=useState([]);
    const handleSelectedRating=(rating)=>{
      setSelectedRating((prev)=>prev.includes(rating)?prev.filter((r)=>r!=rating):[...prev,rating]);
    }
    const showMore = () => {
        setVisibleCount((prev) => Math.min(prev + 5, services.length));
      };
    const handleCheckboxChange = (id) => {
        setSelectedTypes((prev) =>
            prev.includes(id)
            ? prev.filter((service_id) => service_id !== id)
            : [...prev, id]
        );
    };
    const getLoc=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get5?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setLoc(data[0]?.car_wash_location);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getData=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get4`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const update=()=>{
        const id = localStorage.getItem('login_id');
        fetch(`http://localhost:5059/api/User/put3?userid=${id}&place=${loc}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                getLoc();
            },(error)=>{
                toast.error('Failed');
            })
    }
    const getServices=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get2`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const searchData=async(e)=>{
        e.preventDefault();
        const requestBody = {
            selectedTypes: selectedTypes,
            name: name,          
            place: place,
            selectedRating: selectedRating              
        };
    
        try {
            const response = await fetch("http://localhost:5059/api/CarWash/Search", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(requestBody), 
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setFilteredData(data); 
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        getLoc();
        getData();
        getServices();
    },[])
    useEffect(()=>{
        setFilteredData(data);
    },[data])
  return (
    <div className='flex flex-col mt-28 mb-60'>
        <div className='mb-12 flex flex-col items-center'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5 text-center mb-12'>
            Car Wash Servicers
            </h1>
            <label className='text-lg font-semibold mb-4'>
            Please specify the location where you require the car wash service:
            </label>
            <div className='flex items-center gap-4'>
            <input
                type='text'
                placeholder='Enter location...'
                className='border rounded-lg p-3 w-64 focus:outline-none focus:ring-green-500 focus:border-green-500'
                value={loc}
                onChange={(e)=>setLoc(e.target.value)}
            />
            <button className='bg-green-700 text-white p-3 rounded-lg hover:opacity-95' onClick={update}>
                Update
            </button>
        </div>
    </div>
  <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-t-2 border-b-2 md:border-r-2 md:min-h-screen'>
      <form className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Name:
            </label>
            <input
              type='text'
              id='searchName'
              placeholder='Search name...'
              className='border rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Place:
            </label>
            <input
              type='text'
              id='searchPlace'
              placeholder='Search place...'
              className='border rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'
              value={place}
              onChange={(e)=>setPlace(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2 flex-wrap'>
          <label className="font-semibold">Types:</label>
            <div className="flex flex-col gap-1">
                {services.slice(0, visibleCount).map((service, index) => (
                <div key={index} className="flex items-center gap-1">
                    <input
                    type="checkbox"
                    id={service.service_id}
                    className="w-5"
                    checked={selectedTypes.includes(service.service_id)}
                    onChange={() => handleCheckboxChange(service.service_id)}
                    />
                    <label htmlFor={service.services} className="font-medium">
                    {service.services}
                    </label>
                </div>
                ))}
            </div>
            {visibleCount < services.length && (
                <button type="button"
                className="text-blue-700 text-left"
                onClick={showMore}
                >
                Show More
                </button>
            )}
            <label className="font-semibold mt-2">Ratings:</label>
            <div className="flex flex-col gap-1">
              {[4,3].map((rating)=>(
                <div className="flex items-center gap-x-2">
                    <input type="checkbox" checked={selectedRating.includes(rating)} onChange={()=>handleSelectedRating(rating)}/>
                    <label className='flex items-center gap-x-1'>{rating}<FaStar className='text-yellow-500'/> & above</label>
                </div>))}
            </div>
          </div>
          <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95' onClick={searchData}>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <div className='p-7 flex flex-wrap gap-4 justify-center'>
            {filteredData && filteredData.length>0 ? (
                filteredData.map((servicer)=>(
                <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
                    <div className='p-3 flex flex-col gap-2 w-full'> 
                        <p className='text-lg font-semibold text-slate-600 flex items-center'>{servicer.username}<img src={verified} height={25} width={25}/></p>
                        <div className='flex items-center'>
                          <p className="inline-flex w-fit items-center font-medium mr-2 bg-yellow-500 px-4 rounded-lg text-white">{servicer.rating?servicer.rating.toFixed(1):0}<FaStar className='ml-1'/></p>
                          <p className="text-gray-600">({servicer.num_rating})</p>
                        </div>
                        <p className='text-md font-semibold text-slate-600'>Place: <span className=' text-slate-700'>{servicer.location}</span></p>
                        <Link to={`/carwash/${servicer.id}`} type="button" className=" text-white mt-1 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View</Link>
                    </div>
                </div>
            ))):(<p className='text-xl text-slate-700 mt-40'>No Servicers Available!</p>)}
        </div>
    </div>
    </div>
    </div>
  )
}

export default CarWashSearch