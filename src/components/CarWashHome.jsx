import React, { useEffect, useState } from 'react'
import Card from './Card'
import { CiCircleAlert } from "react-icons/ci";
import { GrServices } from "react-icons/gr";
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
const CarWashHome = () => {
  const [data,setData]=useState([]);
  const [count,setCount]=useState([]);
  const fetchBooking=async()=>{
    const carwash_id=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/Booking/Get5?carwash_id=${carwash_id}`;
    try{ 
        const response=await fetch(url); 
        const data=await response.json(); 
        setData(data); 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const fetchCounts=async()=>{
    const id=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/Booking/Get6?id=${id}`;
    try{
        const response=await fetch(url);
        const data=await response.json(); 
        setCount(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  useEffect(()=>{
    fetchBooking();
    fetchCounts();
  },[])
  const handleStatusChange = async(bookingId, newStatus) => {
    setData((prevData) =>
      prevData.map((booking) =>
        booking.booking_id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    const response = await fetch(`http://localhost:5059/api/Booking/Put3?booking_id=${bookingId}&status=${newStatus}`,{
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
      })
      if(response.ok){
          toast.success("Status Updated!");
          await fetchCounts();
      }
      else{
          toast.error("Error");
      }
  };
  return (
    <div className='pb-14 pt-16 mt-20 mx-20'>
        {count.map((val)=>(
        <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8 mx-96'
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:1}}>
                <Card name="Active Alerts" icon={CiCircleAlert} value={val.active_alerts} color='#6366F1'/>
                <Card name="Total Completed Services" icon={GrServices} value={val.completed_alerts} color='#8B5CF6'/>
            </motion.div>))}
        <h1 className='flex justify-center text-5xl font-bold text-left pb-5 mt-20'>Active Alerts</h1>
        {data.filter((booking)=>booking.status==='Confirmed').length>0 ? 
          (<ul className="list-none mt-3 mx-60">
            {data.filter((booking)=>booking.status==='Confirmed').map((booking)=>(
              <li key={booking.booking_id} className="border-2 p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className='text-[18px] flex items-center gap-0.5'>User: {booking.username}</p>
                  <p>Phone: <span className='text-gray-700'>{booking.phone_number}</span></p>
                  <p>Place: <span className='text-gray-700'>{booking.user_location}</span></p>
                  <p>Service: <span className='text-gray-700'>{booking.services}</span></p>
                  <p>Booking Date & Time: <span className='text-gray-700'>{new Date(booking.date).toLocaleDateString("en-GB")} | {booking.time}</span></p>
                </div>
                <p className='text-lg'>Status: <select value={booking.status} onChange={(e)=>handleStatusChange(booking.booking_id, e.target.value)} className="ml-2 border border-gray-400 rounded-lg p-1">
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option></select></p>
              </li>))}</ul>):<h2 className='flex justify-center text-2xl font-semibold text-left pb-10'>No Active Alerts!</h2>}
          <h1 className='flex justify-center text-5xl font-bold text-left pb-5 mt-20'>Services History</h1>
          {data.filter((booking) =>booking.status==='Completed').length>0 ? 
          (<ul className="list-none mt-3 mx-60">
            {data.filter((booking)=>booking.status==='Completed').map((booking)=>(
            <li key={booking.booking_id} className="border-2 p-4 mb-4 flex justify-between items-center">
              <div>
                <p className='text-[18px] flex items-center gap-0.5'>User: {booking.username}</p>
                <p>Phone: <span className='text-gray-700'>{booking.phone_number}</span></p>
                <p>Place: <span className='text-gray-700'>{booking.user_location}</span></p>
                <p>Service: <span className='text-gray-700'>{booking.services}</span></p>
                <p>Booking Date & Time: <span className='text-gray-700'>{new Date(booking.date).toLocaleDateString("en-GB")} | {booking.time}</span></p>
              </div>
              <p className='text-lg'>Status: <select value={booking.status} onChange={(e)=>handleStatusChange(booking.booking_id, e.target.value)} className="ml-2 border border-gray-400 rounded-lg p-1">
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option></select></p>
            </li>))}</ul>):<h2 className='flex justify-center text-2xl font-semibold text-left pb-10'>No Services Completed!</h2>}
    </div>
  )
}

export default CarWashHome