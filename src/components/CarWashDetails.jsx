import React, { useEffect, useState } from 'react'
import { useParams,useLocation } from 'react-router-dom'
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import { FaStar,FaStarHalfAlt,FaRegStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import getStripe from './getStripe'
import axios from 'axios'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoCalendar } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";


const CarWashDetails = () => {
    const {id}=useParams();
    const [data,setData]=useState([]);
    const [data1,setData1]=useState([]);
    const [services,setServices]=useState([]);
    const [reviews,setReviews]=useState([]);
    const [userRating, setUserRating] = useState(0);
    const [newReview,setNewReview]=useState("");
    const [fRating,setFRating]=useState("");
    const [hasRated,setHasRated]=useState(false);
    const [open,setOpen]=useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isDateSelected, setIsDateSelected] = useState(false); 
    const [timeSlot,setTimeSlot]=useState();
    const [selectedTime,setSelectedTime]=useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [place,setPlace]=useState('');
    const [servicerPlace,setServicerPlace]=useState('');
    const [offDates,setOffDates]=useState([]);
    const [offDays,setOffDays]=useState([]);
    const [allTime,setAllTime]=useState([]);
    const [bookedDates,setBookedDates]=useState([])
    useEffect(()=>{
        getTime();
    },[])
    const dayNameToIndex = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };
    const getTime=()=>{
        const timeList=[];
        for(let i=10;i<=12;i++){
            timeList.push({time:i+':00 AM'})
            timeList.push({time:i+':30 AM'})
        }
        for(let i=1;i<=6;i++){
            timeList.push({time:i+':00 PM'})
            timeList.push({time:i+':30 PM'})
        }
        setAllTime(timeList);
        setTimeSlot(timeList);
    }
    const handleCheckboxChange = (service) => {
        const isSelected = selectedServices.some((item) => item.service_id === service.service_id);
        if (isSelected) {
          setSelectedServices(selectedServices.filter((item) => item.service_id !== service.service_id));
        } else {
          setSelectedServices([...selectedServices, service]);
        }
      };
    const handleRatingChange = (e) => {
        setUserRating(parseFloat(Number(e.target.value).toFixed(1)));
    };    
    const fetchData=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get5?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          setServicerPlace(data[0].location);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchServices=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get6?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setServices(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchPlace=async()=>{
        const id=localStorage.getItem('login_id');
        const url1=`http://localhost:5059/api/CarWash/Get7?id=${id}`;
        try{
            const response1=await fetch(url1);
            const data=await response1.json();
            setPlace(data[0].car_wash_location);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchRating=async()=>{
        const url1=`http://localhost:5059/api/CarWashRating/Get1?carwash_id=${id}`;
        try{
            const response1=await fetch(url1);
            const data1=await response1.json();
            setData1(data1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleReview=()=>{
        const userid=localStorage.getItem('login_id');
        const newDate = new Date()
        const date = newDate.toISOString();
        fetch(`http://localhost:5059/api/CarWashReview?carwash_id=${id}&userid=${userid}&review=${newReview}&date=${date}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:id,
                userid:userid,
                newReview:newReview,
                date:date
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            toast.success("Review Added.");
            setNewReview('')
            fetchReview();
        },(error)=>{
            toast.error("Error");
        })
    }
    const fetchReview=async()=>{
        const url1=`http://localhost:5059/api/CarWashReview/Get1?carwash_id=${id}`;
        try{
            const response=await fetch(url1);
            const reviews=await response.json();
            setReviews(reviews)
            console.log(reviews)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleRemoveReview=(review_id)=>{
        fetch(`http://localhost:5059/api/CarWashReview?id=${review_id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                review_id:review_id,
            })
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                fetchReview();
            },(error)=>{
                toast.error('Failed');
            })
    }
    const handleRating=(value)=>{
        const userid=localStorage.getItem('login_id');
        if(value==="submit"){
            console.log(userRating)
        fetch(`http://localhost:5059/api/CarWashRating?carwash_id=${id}&userid=${userid}&rating=${userRating}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:id,
                userid:userid,
                userRating:userRating
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            toast.success("Submitted Rating.");
            fetchUserRating();
            fetchRating();
        },(error)=>{
            toast.error("Error");
        })}
        else if(value==="update"){
            if(fRating>=0 && fRating<=5){
                fetch(`http://localhost:5059/api/CarWashRating/Put1?carwash_id=${id}&userid=${userid}&rating=${fRating}`,{
                    method:'PUT',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        id:id,
                        userid:userid,
                        fRating:fRating
                    })
                })
                .then(res=>res.json())
                .then((result)=>{
                    toast.success("Updated Rating!");
                    fetchRating();
                },(error)=>{
                    toast.error("Error");
                })
            }
            else{
                toast.error("Enter a valid rating!");
            }
        }
    }
    const fetchUserRating=async()=>{
        const userid=localStorage.getItem('login_id');
        const url=`http://localhost:5059/api/CarWashRating/Get2?carwash_id=${id}&userid=${userid}`;
        try{
            const response=await fetch(url);
            const rating=await response.json();
            if(rating && rating[0]){
                setFRating(rating[0].rating);
                setHasRated(true);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getOffDates=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get9?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setOffDates(data);
          console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getOffDays=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get8?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setOffDays(data);
          console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getBookedDates=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get10?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setBookedDates(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleBook=async()=>{
        if(selectedServices.length>0 && place!=='' && isDateSelected && selectedTime!==''){
            const userid=localStorage.getItem('login_id');
            try { 
                const stripe = await getStripe(); 
                const response = await axios.post('http://localhost:5059/api/stripe/servicer-session',selectedServices, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${'pk_test_51P2BgZSAzlT6XHrmRqB6GtO9EsXpgACjyDyyXoe27XlLTUcJOoOr7ZL2jIUplaw1tiFA6P555aBeJcVDG4ymKkR100PcI3TmGD'}`
                    }
                });
                const { sessionId } = response.data;
                console.log('sessionId',sessionId);
                toast.loading('Redirecting to checkout...');
                {data.map((servicer)=>{
                    const name=servicer.username;
                    localStorage.setItem("servicerBookingDetails",JSON.stringify({id,name,userid,place,selectedServices,servicerPlace,selectedDate,selectedTime}))
                    localStorage.setItem("status","servicer");
                })}
                stripe.redirectToCheckout({ sessionId });
            } catch (error) {
                console.error('Error creating checkout session:', error);
                toast.error('Error creating checkout session. Please try again later.');
            }
        }
        else{
            toast.error("Please fill all fields!")
        }
    }
    const handleDialog=()=>{
        setOpen(!open);
    }
    useEffect(()=>{
        fetchData();
        fetchServices();
        fetchPlace();
        fetchRating();
        fetchReview();
        fetchUserRating();
        getOffDates();
        getOffDays();
        getBookedDates();
    },[])
  return (
    <div className="flex flex-col justify-between items-center mt-40 mb-60">
        {data.map((servicer)=>(
            <div className='flex items-start flex-col justify-center border border-gray-400 rounded-lg p-10 py-7 bg-white mt-[-80px] sm:mt-0 w-[40%]'>
                <p className='flex items-center justify-between gap-1 text-2xl font-medium text-gray-900'>{servicer.username} <img src={verified} height={25} width={25}/></p>
                <p><span className='text-gray-600'>Contact:</span> {servicer.phone_number}</p>
                <p><span className='text-gray-600'>Place:</span> {servicer.location}</p>
                <p><span className='text-gray-600'>About:</span> {servicer.about}</p>
                {data1.map((rating)=>(
                <div className='flex items-center mt-3'>
                    <p className="flex items-center font-medium mr-2 bg-yellow-500 px-4 rounded-lg text-white">{rating.rating?rating.rating.toFixed(1):0}<FaStar className='ml-1'/></p>
                    <div className="flex text-yellow-500 items-center">
                        {Array.from({ length: 5 }, (_, index) => {
                        const fullStars = Math.floor(rating.rating);
                        const isHalfStar = rating.rating % 1 >= 0.5;
                        if (index < fullStars) {
                            return <FaStar key={index} />;
                        } else if (index === fullStars && isHalfStar) {
                            return <FaStarHalfAlt key={index} />;
                        } else {
                            return <FaRegStar key={index} />;
                        }
                    })}
                    </div>
                    <p className="ml-2 text-gray-600">({rating.num_rating})</p>
                </div>
                ))}
                {services.length>0 ? <div><p className="text-gray-600 mt-2">Services:</p>
                <div className="grid grid-cols-3 gap-2">
                    {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md"
                    >
                        <div>
                        <p className="text-gray-700 font-medium">{service.services}</p>
                        <p className="text-gray-500 text-sm">Fee: <span className='text-gray-700'>₹{service.fee}</span></p>
                        <p className="text-gray-500 text-sm">Type: <span className='text-gray-700'>{service.type}</span></p>
                        </div>
                        <div>
                        <input
                            type="checkbox"
                            checked={selectedServices.some((item) => item.service_id === service.service_id)}
                            onChange={() => handleCheckboxChange(service)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        </div>
                    </div>
                    ))}
                </div></div>
                :<p>No Services Available!</p>}
                <button onClick={handleDialog} className="self-center text-white mt-4 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Book</button>
                <Dialog open={open} onClose={handleDialog} maxWidth="md" fullWidth>
                    <DialogTitle className='flex justify-center text-black'>Book Appointment</DialogTitle>
                    <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className='grid grid-cols-1 md:grid-cols-2 mt-5'>
                            <div className='flex flex-col gap-3 items-baseline'>
                                <h2 className='flex gap-2 items-center text-gray-600'>
                                    <IoCalendar className='text-blue-600 h-5 w-5'/> Select Date
                                </h2>
                                <div>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={(newDate) => {
                                        setSelectedDate(newDate);
                                        setIsDateSelected(true);
                                        const selectedDateString = new Date(newDate).toDateString();
                                        const disabledBookedTimeSlots = Array.from(new Set(bookedDates
                                            .filter(
                                                (booking) => new Date(booking.date).toDateString() === selectedDateString
                                            )
                                            .map((booking) => booking.time)));
                                        const disabledOffTimeSlots = Array.from(new Set(offDates
                                            .filter(
                                                (offDate) =>
                                                    new Date(offDate.off_date).toDateString() === selectedDateString
                                            )
                                            .map((offDate) => offDate.time)));
                                        const normalizeTime = (time) => time.replace(/^0/, '').trim();
                                        const allDisabledTimeSlots = [...disabledBookedTimeSlots, ...disabledOffTimeSlots].map(normalizeTime);
                                        const updatedTimeSlots = allTime.filter(
                                            (timeObj) => !allDisabledTimeSlots.includes(timeObj.time)
                                        );
                                        setTimeSlot(updatedTimeSlots.length > 0 ? updatedTimeSlots : []);
                                    }}
                                    className="rounded-md border-2"
                                    shouldDisableDate={(date) => {
                                        const dayjsDate = dayjs(date);
                                        const today = dayjs(); 
                                        if (dayjsDate.isBefore(today, 'day')) {
                                            return true;
                                        }
                                        const disabledDays = offDays.map((day) => dayNameToIndex[day.day]);
                                        const isDayDisabled = disabledDays.includes(date.day());
                                        const selectedDateString = new Date(date).toDateString();
                                        const hasNullTimeSlot = offDates.some(
                                            (offDate) =>
                                                new Date(offDate.off_date).toDateString() === selectedDateString &&
                                                offDate.time === null
                                        );
                                        return isDayDisabled || hasNullTimeSlot;
                                    }}
                                />

                                </div>
                            </div>
                            <div>
                                <h2 className='flex gap-2 items-center mb-3 text-gray-600'><FaRegClock className='text-blue-600 h-5 w-5'/> Select Time Slot</h2>
                                <div className='grid grid-cols-3 gap-2 border rounded-lg p-5'>
                                    {timeSlot.map((item)=>(
                                        <h2 className={`p-2 border rounded-full flex justify-center cursor-pointer hover:bg-blue-600 hover:text-white duration-100 ${item.time===selectedTime && `bg-blue-600 text-white`}`} onClick={()=>setSelectedTime(item.time)}
                                        disabled={
                                            bookedDates.some((booking) => new Date(booking.date).toDateString() === new Date(selectedDate).toDateString() && booking.time === item.time)
                                        }>{item.time}</h2>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </LocalizationProvider>
                    <p className='flex items-center gap-2 mt-3'><IoLocation 
                    className='text-blue-600 h-5 w-5'/> <span className='text-gray-600'>Location for Service:</span> <input
                    type='text'
                    id='typePlace'
                    className='border rounded-lg p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    value={place}
                    onChange={(e)=>setPlace(e.target.value)}/></p>
                    <div className="mt-5">
                        <h2 className="text-lg text-gray-600 mb-3">
                            Selected Services
                        </h2>
                        <div className="border rounded-lg p-4">
                            {selectedServices.map((service) => (
                            <div
                                key={service.service_id}
                                className="flex justify-between items-center mb-2"
                            >
                                <div>
                                <p className="text-gray-700 font-medium">{service.services}</p>
                                <p className="text-sm text-gray-500">{service.type}</p>
                                </div>
                                <span className="text-gray-500">₹{service.fee}</span>
                            </div>
                            ))}
                            <hr className="my-2" />
                            <div className="flex justify-between items-center">
                            <span className="text-blue-600">Total Fee:</span>
                            <span className=" text-blue-600">
                                ₹
                                {selectedServices.reduce(
                                (total, service) => total + service.fee,0
                                )}
                            </span>
                            </div>
                        </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleBook} color="primary">
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        ))}
        <div className="flex items-start flex-col justify-center border border-gray-400 rounded-lg p-56 py-20 bg-white mt-4 w-[40%]">
            {!hasRated?<div className='self-center'><p className=" text-xl font-medium mb-4">Rate the Servicer</p>
            <div className="w-full flex items-center">
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={userRating}
                    onChange={handleRatingChange}
                    className="w-full h-2 bg-gray-300 rounded-lg accent-yellow-500 cursor-pointer focus:outline-none"
                />
                <span className="ml-4 text-gray-700" style={{width:"1rem"}}>{userRating}</span>
            </div>
            </div>:<p className='flex items-center self-center font-medium text-xl'>Your Rating: <input value={fRating} onChange={(e) => setFRating(e.target.value)}
            className="ml-2 w-16 p-1 text-center border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/></p>} 
            <button onClick={()=>handleRating(!hasRated?"submit":"update")} className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{!hasRated?"Submit":"Update"}</button>              
            <p className="self-center text-3xl font-medium mt-12 mb-5">Reviews</p>
            {reviews.length > 0 ? (
                <ul className="w-full list-none">
                    {reviews.map((review, index) => (
                    <li
                    key={index}
                    className="flex flex-col justify-start items-start p-4 mb-4 border border-gray-300 rounded-lg "
                    >
                    <div className="flex justify-between w-full gap-4">
                        <p className="text-gray-800 font-bold">{review.username}</p>
                        <p className="text-gray-500 text-sm mt-1">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between w-full items-center mt-2">
                        <p className="text-gray-700 leading-relaxed break-words">{review.review}</p>
                        <button
                        onClick={() => handleRemoveReview(review.review_id)}
                        className="text-white bg-red-600 hover:bg-red-700 duration-100 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2 ml-4"
                        >
                        Remove
                        </button>
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="self-center text-gray-500 mb-2">No reviews yet.</p>
            )}
            <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review here..."
                className="w-[160%] self-center p-3 border border-gray-400 rounded-lg mb-4 mt-4"
            ></textarea>
            <button onClick={handleReview} className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post Review</button>
      </div>
    </div>
  )
}

export default CarWashDetails