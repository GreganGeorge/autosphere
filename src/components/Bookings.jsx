import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast from 'react-hot-toast';
import { IoCalendar } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

const Bookings = (val) => {
  const [data,setData]=useState([]);
  const [open,setOpen]=useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isDateSelected, setIsDateSelected] = useState(false); 
  const [timeSlot,setTimeSlot]=useState();
  const [selectedTime,setSelectedTime]=useState('');
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
  const getBookedDate=async(id)=>{
    const url=`http://localhost:5059/api/Booking/Get7?id=${id}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setSelectedDate(dayjs(data[0]?.date));
        setSelectedTime(data[0]?.time.replace(/^0/, '').trim());
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const getOffDates=async(id)=>{
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
  const getOffDays=async(id)=>{
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
  const getBookedDates=async(id)=>{
      const url = `http://localhost:5059/api/CarWash/Get10?id=${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setBookedDates(data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }
  const handleUpdate=async(id)=>{
    if(isDateSelected && selectedTime!==''){
      fetch(`http://localhost:5059/api/Booking/Put4?booking_id=${id}&date=${selectedDate}&time=${selectedTime}`,{
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        })
        .then(res=>res.json())
        .then((result)=>{
            toast.success("Date Updated");
            setOpen(!open);
            fetchCarWashBooking();
        },(error)=>{
            toast.error('Failed');
        })
    }
  }
  const fetchBooking=async()=>{
    const userid=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/Booking/Get1?userid=${userid}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const fetchCarWashBooking=async()=>{
    const userid=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/Booking/Get4?userid=${userid}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const checkBookingTime = (bookingDate, bookingTime) => {
    const formattedDate = bookingDate.split("T")[0];  
    const bookingDateTime = new Date(`${formattedDate}T${convertTo24Hour(bookingTime)}`);
    const currentDate = new Date();
    const timeDifference = bookingDateTime - currentDate;
    return timeDifference > 24 * 60 * 60 * 1000;
  };
  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours) + 12);
    } else if (modifier === "AM" && hours === "12") {
        hours = "00";
    }
    return `${hours}:${minutes}`;
  };
  const handleDialog=()=>{
    setOpen(!open);
  }
  useEffect(()=>{
    if(val?.val==='mechanic'){
      fetchBooking();
    }
    else if(val?.val==='car wash'){
      fetchCarWashBooking();
    }
  },[])
  return (
    <div>
      {data.length>0?(
        <>
      {val?.val==='mechanic' &&
        <ul className="list-none mt-3">
            {data.map((booking) => (
              <li key={booking.booking_id} className="border p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className='text-[18px] flex items-center gap-0.5'>{booking.mechanic_name}<img src={verified} height={25} width={25}/></p>
                  {booking.travel_time && (
                      <p>Travel Time: <span className='text-gray-700'>{Math.round(booking.travel_time)} min</span></p>
                  )}
                  <p>Status: <span className='text-gray-700'>{booking.status}</span></p>
                  <p>Booking Date & Time: <span className='text-gray-700'>{new Date(booking.date).toLocaleDateString("en-GB")} | {booking.time}</span></p>
                </div>
                <Link to={`/mechanic/${booking.mechanic_id}`} state={{travelTime:Math.round(booking.travel_time)}} type="button" className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View</Link>                
              </li>
            ))}
        </ul>}
      {val?.val==='car wash' && <ul className="list-none mt-3">
          {data.map((booking) => {
            const showButton = checkBookingTime(booking.date, booking.time);
            return(
              <li key={booking.booking_id} className="border p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className='text-[18px] flex items-center gap-0.5'>{booking.carwash_name}<img src={verified} height={25} width={25}/></p>
                  <p>Location: <span className='text-gray-700'>{booking.user_location}</span></p>
                  <div className="flex gap-2 items-center">
                      <p>{booking.services} - </p>
                      <span className="text-gray-700">₹{booking.fee}</span>
                  </div>
                  <p>Status: <span className='text-gray-700'>{booking.status}</span></p>
                  <p>Booking Date & Time: <span className='text-gray-700'>{new Date(booking.date).toLocaleDateString("en-GB")} | {booking.time}</span></p>
                </div>
                <div className='flex flex-col gap-2'>
                  <Link to={`/carwash/${booking.carwash_id}`} type="button" className="self-center w-[110px] text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View</Link>
                  {showButton && <button onClick={()=>{handleDialog();getBookedDate(booking.booking_id);getOffDates(booking.carwash_id);getOffDays(booking.carwash_id);getBookedDates(booking.carwash_id);}} className=" text-white bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Postpone</button>}   
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
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={()=>{handleUpdate(booking.booking_id)}} color="primary">
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
                </div>             
              </li>);
            })}
      </ul>}
      </>):
      <h2 className='mt-12 text-center text-[16px] font-semibold'>
          No Bookings Yet!
      </h2>}
    </div>
  )
}

export default Bookings