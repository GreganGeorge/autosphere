import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar,FaStarHalfAlt,FaRegStar } from 'react-icons/fa'
import toast from 'react-hot-toast';
import { PiSteeringWheelFill } from "react-icons/pi";
import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { FaGasPump } from 'react-icons/fa6';
import { MdSpeed } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa"; 
import { FaBatteryFull } from "react-icons/fa"; 
import { MdLocalGasStation } from "react-icons/md"; 
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { LocalizationProvider, DateCalendar, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoLocation } from "react-icons/io5";
import getStripe from './getStripe'
import axios from 'axios';

const CarRentalDetails = () => {
    const {id}=useParams();
    const [imageURL,setImageURL]=useState('');
    const [transmission,setTransmission]=useState('');
    const [fuelType,setFuelType]=useState('');
    const [brand,setBrand]=useState('');
    const [model,setModel]=useState('');
    const [year,setYear]=useState();
    const [rent,setRent]=useState();
    const [seats,setSeats]=useState();
    const [location,setLocation]=useState('');
    const [capacity,setCapacity]=useState();
    const [mileage,setMileage]=useState();
    const [returnDate,setReturnDate]=useState();
    const [description,setDescription]=useState('');
    const [rating,setRating]=useState([]);
    const [tab,setTab]=useState('description');
    const [fRating,setFRating]=useState("");
    const [hasRated,setHasRated]=useState(false);
    const [userRating, setUserRating] = useState(0);
    const [newReview,setNewReview]=useState("");
    const [reviews,setReviews]=useState([]);
    const [openDialog,setOpenDialog]=useState(false);
    const [place,setPlace]=useState('');
    const [fromSelectedDate,setFromSelectedDate]=useState();
    const [toSelectedDate,setToSelectedDate]=useState();
    const [bookings,setBookings]=useState([]);
    const [prevBookings,setPrevBookings]=useState([]);
    const [currentLocation,setCurrentLocation]=useState('');
    const [agreed,setAgreed]=useState(false);
    const getData=async()=>{
        const url = `http://localhost:5059/api/CarRental/Get2?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setBrand(data[0].brand);
          setModel(data[0].model);
          setYear(data[0].year);
          setRent(data[0].rentFee);
          setSeats(data[0].seats);
          setTransmission(data[0].transmission);
          setLocation(data[0].location);
          setFuelType(data[0].fuelType);
          setCapacity(data[0].capacity);
          setMileage(data[0].mileage);
          setReturnDate(data[0].date);
          setDescription(data[0].description);
          setImageURL(data[0].image_url);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getBooking=async()=>{
        const url = `http://localhost:5059/api/CarRental/Get7?id=${id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getRating=async()=>{
        const url = `http://localhost:5059/api/CarRental/Get3?car_id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setRating(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const handleRating=(value)=>{
        const userid=localStorage.getItem('login_id');
        if(value==="submit"){
        fetch(`http://localhost:5059/api/CarRental/Post2?car_id=${id}&userid=${userid}&rating=${userRating}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
        })
        .then(res=>res.json())
        .then((result)=>{
            toast.success("Submitted Rating.");
            fetchUserRating();
            getRating();
        },(error)=>{
            toast.error("Error");
        })}
        else if(value==="update"){
            if(fRating>=0 && fRating<=5){
                fetch(`http://localhost:5059/api/CarRental/Put1?car_id=${id}&userid=${userid}&rating=${fRating}`,{
                    method:'PUT',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                })
                .then(res=>res.json())
                .then((result)=>{
                    toast.success("Updated Rating!");
                    getRating();
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
        const url=`http://localhost:5059/api/CarRental/Get4?car_id=${id}&userid=${userid}`;
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
    const handleRatingChange = (e) => {
        setUserRating(parseFloat(Number(e.target.value).toFixed(1)));
    }; 
    const handleReview=()=>{
        if(newReview!==''){
        const userid=localStorage.getItem('login_id');
        const newDate = new Date()
        const date = newDate.toISOString();
        fetch(`http://localhost:5059/api/CarRental/Post3?car_id=${id}&userid=${userid}&review=${newReview}&date=${date}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
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
        else{
            toast.error("Please enter a review!");
        }
    }
    const fetchReview=async()=>{
        const url1=`http://localhost:5059/api/CarRental/Get5?car_id=${id}`;
        try{
            const response=await fetch(url1);
            const reviews=await response.json();
            setReviews(reviews)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getPrevBooking=async()=>{
        const url = `http://localhost:5059/api/CarRental/Get9`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setPrevBookings(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    const getLocation=(data)=>{
        const currentBooking = data.find(booking => {
            const from = dayjs(booking.fromDate);
            const to = dayjs(booking.toDate);
            const isBetween = dayjs().isBetween(from, to, 'day', '[]');
            const matchesCarId = booking.car_id == id;     
            return matchesCarId && isBetween && booking.value !== "Return";
        });
        if(currentBooking){
            setCurrentLocation(currentBooking.user_location);
        }
        else{
            setCurrentLocation(location);
        }
    }
    const handleRemoveReview=(review_id)=>{
        fetch(`http://localhost:5059/api/CarRental/Delete1?id=${review_id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                fetchReview();
            },(error)=>{
                toast.error('Failed');
            })
    }
    const handleBook=async()=>{
        if(place!=='' && toSelectedDate!==undefined && fromSelectedDate!==undefined && agreed!==false){
            const login_id=localStorage.getItem('login_id');
            const amount=fromSelectedDate && toSelectedDate ? (dayjs(toSelectedDate).startOf("day").diff(dayjs(fromSelectedDate).startOf("day"), "day") + 1) * rent : 0;
            const requestBody = [{
                place: place,
                id: parseInt(id),          
                login_id: parseInt(login_id),
                toSelectedDate: toSelectedDate.format("YYYY-MM-DD"),
                fromSelectedDate: fromSelectedDate.format("YYYY-MM-DD"),
                amount: amount,
            }];
            try { 
                const stripe = await getStripe(); 
                const response = await axios.post('http://localhost:5059/api/stripe/carrental-session',requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${'pk_test_51P2BgZSAzlT6XHrmRqB6GtO9EsXpgACjyDyyXoe27XlLTUcJOoOr7ZL2jIUplaw1tiFA6P555aBeJcVDG4ymKkR100PcI3TmGD'}`
                    }
                });
                const { sessionId } = response.data;
                toast.loading('Redirecting to checkout...');
                localStorage.setItem("carBookingDetails",JSON.stringify(requestBody))
                localStorage.setItem("status","carrental");
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
    useEffect(()=>{
        getData();
    },[id])
    useEffect(()=>{
        getRating();
        fetchUserRating();
        fetchReview();
        getBooking();
        getPrevBooking();
    },[])
    useEffect(() => {
        if (prevBookings.length > 0) {
            getLocation(prevBookings);
        }
    }, [prevBookings,id]);
  return (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100 mt-36 mb-40">
        <div className="gap-12 mx-40">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-20">
                <img src={imageURL} alt={brand} className="w-[600px] max-h-[400px] object-cover rounded-lg shadow-md hover:scale-[1.02] transition ease-in-out duration-300" />
                <div className="flex-1 text-center sm:text-left">
                    <p className="font-semibold text-xl mt-2 text-gray-800">{brand} {model}</p>
                    {rating.map((rating)=>(
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
                    </div>))}
                    <p className="mt-4 text-[18px] text-gray-700">Owner Location: <span className="font-medium text-black">{location}</span></p>
                    <p className="text-[18px] text-gray-700">Current Location: <span className="font-medium text-black">{currentLocation}</span></p>
                    <p className="text-[18px] text-gray-700">Return Date: <span className="font-medium text-black">{new Date(returnDate).toLocaleDateString("en-GB")}</span></p>
                    <h2 className='text-[24px] font-semibold mb-2 mt-2'>
                        <span className='text-[14px] font-light'>₹ </span>
                        {rent}
                        <span className='text-[14px] font-light'> /day</span>
                    </h2>
                    <button onClick={()=>setOpenDialog(!openDialog)} className="self-center text-white mt-4 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Book</button>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-gray-800 text-lg">
                    <p className="font-medium text-xl col-span-2 mb-2">Specifications</p>
                    <p className='flex items-center gap-1'><FaCalendarAlt className='text-[22px] text-blue-700'/>Year: <span className="font-semibold">{year}</span></p>
                    <p className='flex items-center gap-1'><MdAirlineSeatReclineNormal className='text-[22px] text-orange-700'/> Seats: <span className="font-semibold">{seats}</span></p>
                    <p className='flex items-center gap-1'><PiSteeringWheelFill className='text-[22px] text-purple-700'/> Transmission:<span className="font-semibold">{transmission}</span></p>
                    <p className='flex items-center gap-1'><FaGasPump className='text-[22px] text-green-700'/> Fuel Type: <span className="font-semibold">{fuelType}</span></p>
                    {fuelType==='Electric'?<p className='flex items-center gap-1'><FaBatteryFull className='text-[22px] text-green-700'/>Battery Capacity: <span className="font-semibold">{capacity} kWh</span></p>:
                    <p className='flex items-center gap-1'><MdLocalGasStation className='text-[22px] text-green-700'/>Fuel Tank Capacity: <span className="font-semibold">{capacity} L</span></p>}
                    <p className='flex items-center gap-1'><MdSpeed className='text-[22px] text-red-700'/>Mileage: <span className="font-semibold">{fuelType==='Electric'?`${mileage} km/kWh`:`${mileage} km/l`}</span></p>
                </div>
            </div>
        </div>
        <Dialog open={openDialog} onClose={()=>setOpenDialog(!openDialog)} maxWidth="md" fullWidth>
            <DialogTitle className='flex justify-center text-black'>Book Car</DialogTitle>
            <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='mt-5 gap-5'>
                    <div className='flex flex-col gap-4'>
                    <p className='flex items-center gap-2 mt-3 mb-2'><IoLocation 
                        className='text-blue-600 h-5 w-5'/> <span className='text-gray-600'>Location:</span> <input
                        type='text'
                        id='typePlace'
                        className='border rounded-lg p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        value={place}
                        onChange={(e)=>setPlace(e.target.value)}/></p>
                        <div className='grid grid-cols-3 gap-2'>
                            <label className='flex text-gray-600 items-center gap-2'>
                                <label className="font-semibold">From:</label>
                                <DatePicker value={fromSelectedDate} onChange={(newDate) => setFromSelectedDate(newDate)} format="DD/MM/YYYY" disablePast
                                    shouldDisableDate={(date) => {if(toSelectedDate!==undefined && date.isAfter(toSelectedDate) || date.isAfter(returnDate)){
                                        return true;
                                    }return bookings.some(booking =>
                                        (date.isSame(dayjs(booking.fromDate), 'day') || date.isAfter(dayjs(booking.fromDate), 'day')) &&
                                        (date.isSame(dayjs(booking.toDate), 'day') || date.isBefore(dayjs(booking.toDate), 'day'))
                                      );}}
                                    slotProps={{ textField: {
                                        variant: "outlined",
                                        fullWidth: true,
                                        inputProps: { readOnly: true },
                                        sx: {
                                            "& .MuiOutlinedInput-root": {
                                            border: "1px solid #D1D5DB",
                                            borderRadius: "0.5rem", 
                                            width: "100%",
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#10B981", 
                                                boxShadow: "0 0 0 0.5px rgba(16, 185, 129, 0.5)", 
                                            },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#10B981",
                                            },
                                        },
                                    },
                                    }}
                                />
                            </label>
                            <label className='flex text-gray-600 items-center gap-2'>
                                <label className="font-semibold ml-2">To:</label>
                                <DatePicker value={toSelectedDate} onChange={(newDate) => setToSelectedDate(newDate)} format="DD/MM/YYYY" disablePast
                                    shouldDisableDate={(date) => 
                                        {if(date.isBefore(fromSelectedDate) || date.isAfter(returnDate)){
                                            return true;
                                        }return bookings.some(booking =>
                                            (date.isSame(dayjs(booking.fromDate), 'day') || date.isAfter(dayjs(booking.fromDate), 'day')) &&
                                            (date.isSame(dayjs(booking.toDate), 'day') || date.isBefore(dayjs(booking.toDate), 'day'))
                                          );}}
                                    slotProps={{ textField: {
                                        variant: "outlined",
                                        fullWidth: true,
                                        inputProps: { readOnly: true },
                                        sx: {
                                            "& .MuiOutlinedInput-root": {
                                            border: "1px solid #D1D5DB",
                                            borderRadius: "0.5rem", 
                                            width: "100%",
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#10B981", 
                                                boxShadow: "0 0 0 0.5px rgba(16, 185, 129, 0.5)", 
                                            },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#10B981",
                                            },
                                        },
                                    },
                                    }}
                                />
                            </label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" checked={agreed} onChange={()=>setAgreed(!agreed)}/><label className="text-gray-800">I agree to return the car on the specified date. To extend usage, I must book again if available.</label>
                        </div>
                        <div className='grid grid-cols-2'>
                        <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                            <span className="text-blue-600">Total Rent:</span>
                            <span className=" text-blue-600">
                                ₹{fromSelectedDate && toSelectedDate ? (dayjs(toSelectedDate).startOf("day").diff(dayjs(fromSelectedDate).startOf("day"), "day") + 1) * rent : 0}
                            </span>
                            </div>
                        </div>
                        </div>
                    </div> 
                </div>
            </LocalizationProvider>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>setOpenDialog(!openDialog)} color="secondary">
                Cancel
            </Button>
            <Button onClick={handleBook} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        <div className='mt-20 mx-60'>
            <div className='flex'>
                <button onClick={()=>setTab('description')} className={`${tab==='description'&&'bg-green-600 text-white font-medium'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                        border border-solid border-green-600`}>Description</button>
                <button onClick={()=>setTab('rating')} className={`${tab==='rating'&&'bg-green-600 text-white font-medium'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                        border border-solid border-green-600`}>Rating</button>
                <button onClick={()=>setTab('review')} className={`${tab==='review'&&'bg-green-600 text-white font-medium'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                        border border-solid border-green-600`}>Reviews</button>
            </div>
            <div className='flex flex-col gap-4 mt-2 text-md text-gray-500'>
                {tab==='description' && <p className='border px-6 py-6'>{description}</p>}
                {tab==='rating' && <div className="flex items-start flex-col justify-center border border-gray-300 rounded-lg py-16 mt-4 w-[30%]">
                {!hasRated?<div className='self-center'><p className=" text-xl font-medium mb-4">Rate the Spare Part</p>
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
                <button onClick={()=>handleRating(!hasRated?"submit":"update")} className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{!hasRated?"Submit":"Update"}</button></div>}
                {tab==='review' && <div className="flex items-start flex-col justify-center border border-gray-300 rounded-lg py-16 px-6 mt-4 w-[30%]"><p className="self-center text-3xl font-medium mb-5">Reviews</p>
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
                        className="w-full self-center p-3 border border-gray-400 rounded-lg mb-4 mt-4"
                    ></textarea>
                    <button onClick={handleReview} className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post Review</button>
            </div>}
            </div>
        </div>
    </div>
  )
}

export default CarRentalDetails