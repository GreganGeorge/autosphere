import React, { useEffect, useState } from 'react'
import Card from './Card'
import { CiCircleAlert } from "react-icons/ci";
import { GrServices } from "react-icons/gr";
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'
import { MdMiscellaneousServices } from "react-icons/md";

const DriverHome = () => {
  const [data,setData]=useState([]);
  const id=localStorage.getItem('login_id');
  const [activeCount,setActiveCount]=useState([]);
  const [acceptedCount,setAcceptedCount]=useState([]);
  const [completedCount,setCompletedCount]=useState([]);
  const fetchBooking=async()=>{
    const url=`http://localhost:5059/api/Driver/Get3`;
    try{ 
        const response=await fetch(url); 
        const data=await response.json(); 
        setData(data);
        setActiveCount(data.filter((booking) =>booking.status===null).length)
        setAcceptedCount(data.filter((booking) =>booking.status==='Accepted' && booking.driver_id===parseInt(id)).length)
        setCompletedCount(data.filter((booking) =>booking.status==='Completed' && booking.driver_id===parseInt(id)).length)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  useEffect(()=>{
    fetchBooking();
  },[])
  const handleStatusChange = async(id, newStatus) => {
    setData((prevData) =>
      prevData.map((booking) =>
        booking.accept_id === id
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    const response = await fetch(`http://localhost:5059/api/Driver/Put2?accept_id=${id}&status=${newStatus}`,{
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
      })
      if(response.ok){
          toast.success("Status Updated!");
          fetchBooking();
      }
      else{
          toast.error("Error");
      }
  };
  const handleAccept=async(id,status)=>{
    Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText:'No',
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
                title: "Request Accepted",
                icon: "success"
            });
            const driver_id=localStorage.getItem('login_id');
            fetch(`http://localhost:5059/api/Driver/Post2?id=${id}&driver_id=${driver_id}&status=${status}`,{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log("Accepted");
                fetchBooking();
            },(error)=>{
                toast.error("Error");
            })
          }
        })
  }
  return (
    <div className='pb-14 pt-16 mt-20 mx-20'>
        <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8 mx-60'
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:1}}>
                <Card name="Active Requests" icon={CiCircleAlert} value={activeCount} color='#8B5CF6'/>
                <Card name="Total Accepted Services" icon={MdMiscellaneousServices} value={acceptedCount} color='#8B5CF6'/>
                <Card name="Total Completed Services" icon={GrServices} value={completedCount} color='#8B5CF6'/>
            </motion.div>
        <h1 className='flex justify-center text-5xl font-bold text-left pb-5 mt-20'>Active Requests</h1>
        {data.filter((booking)=>booking.status===null).length>0 ? 
          (<ul className="list-none mt-3 mx-60">
            {data.filter((booking)=>booking.status===null).map((booking)=>(
              <li key={booking.id} className="border-2 p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className='text-[18px] flex items-center gap-0.5'>User: {booking.username}</p>
                  <p>Phone: <span className='text-gray-700'>{booking.phone_number}</span></p>
                  <p>From: <span className='text-gray-700'>{booking.fromplace}</span></p>
                  <p>To: <span className='text-gray-700'>{booking.toplace}</span></p>
                  <p>Car Booking from: <span className='text-gray-700'>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</span></p>
                  <p>Car Booking to: <span className='text-gray-700'>{new Date(booking.toDate).toLocaleDateString("en-GB")}</span></p>
                </div>
                <button onClick={()=>handleAccept(booking.id,"Accepted")} className=" text-white bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800  hover:scale-105 duration-150 focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">Accept</button>
              </li>))}</ul>):<h2 className='flex justify-center text-2xl font-semibold text-left pb-10'>No Active Requests!</h2>}
        <h1 className='flex justify-center text-5xl font-bold text-left pb-5 mt-20'>Accepted Services</h1>
        {data.filter((booking) =>booking.status==='Accepted' && booking.driver_id===parseInt(id)).length>0 ? 
        (<ul className="list-none mt-3 mx-60">
            {data.filter((booking)=>booking.status==='Accepted' && booking.driver_id===parseInt(id)).map((booking)=>(
            <li key={booking.id} className="border-2 p-4 mb-4 flex justify-between items-center">
            <div>
                <p className='text-[18px] flex items-center gap-0.5'>User: {booking.username}</p>
                <p>Phone: <span className='text-gray-700'>{booking.phone_number}</span></p>
                <p>From: <span className='text-gray-700'>{booking.fromplace}</span></p>
                <p>To: <span className='text-gray-700'>{booking.toplace}</span></p>
                <p>Car Booking from: <span className='text-gray-700'>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</span></p>
                <p>Car Booking to: <span className='text-gray-700'>{new Date(booking.toDate).toLocaleDateString("en-GB")}</span></p>
            </div>
            <p className='text-lg'>Status: <select value={booking.status} onChange={(e)=>handleStatusChange(booking.accept_id, e.target.value)} className="ml-2 border border-gray-400 rounded-lg p-1">
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option></select></p>
            </li>))}</ul>):<h2 className='flex justify-center text-2xl font-semibold text-left pb-10'>No Accepted Services!</h2>}
            <h1 className='flex justify-center text-5xl font-bold text-left pb-5 mt-20'>Services History</h1>
            {data.filter((booking) =>booking.status==='Completed' && booking.driver_id===parseInt(id)).length>0 ? 
            (<ul className="list-none mt-3 mx-60">
                {data.filter((booking)=>booking.status==='Completed' && booking.driver_id===parseInt(id)).map((booking)=>(
                <li key={booking.booking_id} className="border-2 p-4 mb-4 flex justify-between items-center">
                <div>
                    <p className='text-[18px] flex items-center gap-0.5'>User: {booking.username}</p>
                    <p>Phone: <span className='text-gray-700'>{booking.phone_number}</span></p>
                    <p>From: <span className='text-gray-700'>{booking.fromplace}</span></p>
                    <p>To: <span className='text-gray-700'>{booking.toplace}</span></p>
                    <p>Car Booking from: <span className='text-gray-700'>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</span></p>
                    <p>Car Booking to: <span className='text-gray-700'>{new Date(booking.toDate).toLocaleDateString("en-GB")}</span></p>
                </div>
                <p className='text-lg'>Status: <select value={booking.status} onChange={(e)=>handleStatusChange(booking.accept_id, e.target.value)} className="ml-2 border border-gray-400 rounded-lg p-1">
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option></select></p>
                </li>))}</ul>):<h2 className='flex justify-center text-2xl font-semibold text-left pb-10'>No Services Completed!</h2>}
    </div>
  )
}

export default DriverHome