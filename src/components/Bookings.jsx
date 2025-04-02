import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { LocalizationProvider, DateCalendar,DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast from 'react-hot-toast';
import { IoCalendar } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import Swal from 'sweetalert2'
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import ImageUpload from './ImageUpload';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from '../components/firebase';
import { v4 as uuidv4 } from 'uuid';

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
  const [openDialog,setOpenDialog]=useState(false);
  const [openReturnDialog,setOpenReturnDialog]=useState(false);
  const [userPlace,setUserPlace]=useState('')
  const [ownerPlace,setOwnerPlace]=useState('');
  const [fromDate,setFromDate]=useState();
  const [toDate,setToDate]=useState();
  const [id,setId]=useState();
  const [driversInfo,setDriversInfo]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [prevBookings,setPrevBookings]=useState([]);
  const [editDialog,setEditDialog]=useState(false);
  const [imageFile,setImageFile]=useState(null);
  const [transmission,setTransmission]=useState('');
  const [fuelType,setFuelType]=useState('');
  const [brand,setBrand]=useState('');
  const [model,setModel]=useState('');
  const [year,setYear]=useState();
  const [rent,setRent]=useState();
  const [seats,setSeats]=useState();
  const [location,setLocation]=useState('');
  const [fuelCapacity,setFuelCapacity]=useState();
  const [mileage,setMileage]=useState();
  const [returnDate,setReturnDate]=useState();
  const [description,setDescription]=useState('');
  const [imageURL,setImageURL]=useState('');
  const [registrationUrl,setRegistrationUrl]=useState('');
  const [editRegistrationUrl,setEditRegistrationUrl]=useState(null);
  const [cancel,setCancel]=useState();
  const [editId,setEditId]=useState();
  const [originalReturnDate,setOriginalReturnDate]=useState();
  const [registrationCancel,setRegistrationCancel]=useState();
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
  const getCarPosts=async()=>{
    const id = localStorage.getItem('login_id');
    const url = `http://localhost:5059/api/CarRental/Get10?id=${id}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
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
        console.log(data);
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
  const fetchSparePartsBooking=async()=>{
    const userid=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/SpareParts/Get10?id=${userid}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const fetchCarRentalBooking=async()=>{
    const userid=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/CarRental/Get6?userid=${userid}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const fetchYourCarBooking=async()=>{
    const userid=localStorage.getItem('login_id');
    const url=`http://localhost:5059/api/CarRental/Get11?id=${userid}`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const getBooking=async()=>{
    const url = `http://localhost:5059/api/CarRental/Get8`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        setBookings(data);
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
  const isNextDayBooked = (id,to) => {
    return(bookings.some(otherBooking => 
      otherBooking.car_id === id && 
      dayjs(otherBooking.fromDate).isSame(dayjs(to).add(1, 'day'), 'day')
    ))
  };
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
  const handleDialogData=(user,owner,from,to,id,car_id)=>{
    const previousDayBooking = prevBookings.find(otherBooking => 
      otherBooking.car_id === car_id &&
      dayjs(otherBooking.toDate).isSame(dayjs(from).subtract(1, 'day'), 'day') && otherBooking.value!=='Return'
    );
    if(previousDayBooking){
      setOwnerPlace(previousDayBooking.user_location);
    }
    else{
      setOwnerPlace(owner);
    }
    setUserPlace(user);
    setFromDate(from);
    setToDate(to);
    setId(id);
  }
  const handleDriver=async(value)=>{
    if(value==='Delivery'){
      setOpenDialog(!openDialog);
    }
    else if(value==='Return'){
      setOpenReturnDialog(!openReturnDialog);
    }
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
          title: "Request Sent",
          icon: "success"
        });
        let url='';
        if(value==='Delivery'){
          url=`http://localhost:5059/api/Driver/Post1?booking_id=${id}&fromplace=${ownerPlace}&toplace=${userPlace}&value=${value}`;
        }
        else if(value==='Return'){
          url=`http://localhost:5059/api/Driver/Post1?booking_id=${id}&fromplace=${userPlace}&toplace=${ownerPlace}&value=${value}`;
        }
      fetch(url,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
      })
      .then(res=>res.json())
      .then((result)=>{
        console.log("Success");
        getReqDrivers();
      },(error)=>{
          toast.error("Error");
      })
    }})
  }
  function capitalizeEachWord(text) {
    return text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }
  const handleEditCarDialog=async()=>{
    if((imageURL!=='' || imageFile!==null) && (registrationUrl!=='' || editRegistrationUrl!==null) && brand!=='' && model!=='' && year && rent && seats && transmission!=='' && location!=='' && fuelType!=='' && fuelCapacity && mileage && returnDate!==null && description!==''){
      let encodedImageURL=encodeURIComponent(imageURL);
      let encodedRegistrationURL=encodeURIComponent(registrationUrl);
      const formattedDate = returnDate.format("YYYY-MM-DD");
        if(imageFile!==null){
            const uniqueImageName = `${uuidv4()}_${imageFile?.name}`;
            const imageNameRef = ref(storage, `carrental/${uniqueImageName}`);
            const imageNameSnapshot = await uploadBytesResumable(imageNameRef, imageFile);
            const imageNameURL = await getDownloadURL(imageNameSnapshot.ref);
            encodedImageURL = encodeURIComponent(imageNameURL);
        }
        if(editRegistrationUrl!==null){
          const uniqueRegistrationProofName = `${uuidv4()}_${editRegistrationUrl.name}`;
          const RegistrationProofRef = ref(storage, `registrationproof/${uniqueRegistrationProofName}`);
          const RegistrationSnapshot = await uploadBytesResumable(RegistrationProofRef, editRegistrationUrl);
          const registrationURL = await getDownloadURL(RegistrationSnapshot.ref);
          encodedRegistrationURL = encodeURIComponent(registrationURL);
        }
        const newBrand=capitalizeEachWord(brand);
        const newModel=capitalizeEachWord(model);
        fetch(`http://localhost:5059/api/CarRental/Put2?brand=${newBrand}&model=${newModel}&year=${year}&rentFee=${rent}&seats=${seats}&transmission=${transmission}&location=${location}&fuelType=${fuelType}&capacity=${fuelCapacity}&mileage=${mileage}&date=${formattedDate}&description=${description}&image_url=${encodedImageURL}&id=${editId}&registration=${encodedRegistrationURL}`,{
          method:'PUT',
          headers:{
              'Accept':'application/json',
              'Content-Type':'application/json'
          },
          })
          .then(res=>res.json())
          .then((result)=>{
              toast.success("Updated Successfully!");
              setEditDialog(!editDialog);
              setImageFile(null);
              getCarPosts();
          },(error)=>{
          })
      }
      else{
          toast.error("Please fill all fields!")
      }
  }
  const getReqDrivers=async()=>{
    const url=`http://localhost:5059/api/Driver/Get2`;
    try{
        const response=await fetch(url);
        const data=await response.json();
        setDriversInfo(data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
  const handleEditDialog=async(car_id)=>{
    const product=data.find((p)=>p.car_id===car_id);
    setBrand(product.brand);
    setModel(product.model);
    setYear(product.year);
    setRent(product.rentFee);
    setSeats(product.seats);
    setTransmission(product.transmission);
    setLocation(product.location);
    setFuelType(product.fuelType);
    setFuelCapacity(product.capacity);
    setMileage(product.mileage);
    setReturnDate(dayjs(product.date));
    setOriginalReturnDate(dayjs(product.date));
    setDescription(product.description);
    setImageURL(product.image_url);
    setRegistrationUrl(product.registration)
    setEditDialog(!editDialog);
    setEditId(car_id);
    setCancel(false);
    setRegistrationCancel(false);
  }
  const handleCancelDriver=async(id)=>{
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
          title: "Request Deleted",
          icon: "success"
        });
        fetch(`http://localhost:5059/api/Driver?id=${id}`,{
          method:'DELETE',
          headers:{
              'Accept':'application/json',
              'Content-Type':'application/json'
          },
          })
          .then(res=>res.json())
          .then((result)=>{
            console.log("Deleted");
            getReqDrivers();
          },(error)=>{
              toast.error('Failed');
          })
      }
    })
  }
  useEffect(()=>{
    if(val?.val==='mechanic'){
      fetchBooking();
    }
    else if(val?.val==='car wash'){
      fetchCarWashBooking();
    }
    else if(val?.val==='spareparts'){
      fetchSparePartsBooking();
    }
    else if(val?.val==='carrental'){
      fetchCarRentalBooking();
    }
    else if(val?.val==='carrentalposts'){
      getCarPosts();
    }
    else if(val?.val==='carbooking'){
      fetchYourCarBooking();
    }
    getReqDrivers();
    getBooking();
    getPrevBooking();
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
      {val?.val==='spareparts' &&
        <ul className="list-none mt-3">
            {data.map((booking) => (
              <li key={booking.booking_id} className="border p-4 mb-4 flex justify-between items-center">
                <img className='w-24 sm:w-32 object-cover mr-4' src={booking.image_url}/>
                <div className='flex-1'>
                  <p className='text-gray-700'>{booking.brand}</p>
                  <p className='text-[18px] flex items-center gap-0.5'>{booking.title}</p>
                  <div className='flex gap-4'>
                    <p>Quantity: <span className='text-gray-700'>{booking.quantity}</span></p>
                    <p>Date: <span className='text-gray-700'>{new Date(booking.date).toLocaleDateString("en-GB")}</span></p>
                  </div>
                  <p>Price: <span className='text-gray-700'>₹{booking.price}</span></p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{booking.status}</p>
                </div>
              </li>
            ))}
        </ul>}
        {val?.val==='carrental' &&
        <ul className="list-none mt-3">
            {data.map((booking) => {
              const deliveryRequest = driversInfo.find((driver) => driver.booking_id === booking.booking_id && driver.value==='Delivery');
              const returnRequest = driversInfo.find((driver) => driver.booking_id === booking.booking_id && driver.value==='Return');
              return(
              <li key={booking.booking_id} className="border p-4 mb-4 flex justify-between items-center">
                <img className='w-24 sm:w-32 object-cover mr-4' src={booking.image_url}/>
                <div className='flex-1'>
                  <p className='text-gray-800'>{booking.brand} {booking.model}</p>
                  <p>Place: <span className='text-gray-700'>{booking.owner_location}</span></p>
                  <div className='flex gap-4'>
                    <p>From: <span className='text-gray-700'>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</span></p>
                    <p>To: <span className='text-gray-700'>{new Date(booking.toDate).toLocaleDateString("en-GB")}</span></p>
                  </div>
                  <p>Rent: <span className='text-gray-700'>₹{booking.rent}</span></p>
                  {deliveryRequest?.booking_id===booking.booking_id && deliveryRequest?.status==="Accepted" && <div><p>Driver Name: <span className='text-gray-700'>{deliveryRequest.username}</span></p>
                  <p>Driver Phone Number: <span className='text-gray-700'>{deliveryRequest.phone_number}</span></p></div>}
                  {returnRequest?.booking_id===booking.booking_id && returnRequest?.status==="Accepted" && <div><p>Driver Name: <span className='text-gray-700'>{returnRequest.username}</span></p>
                  <p>Driver Phone Number: <span className='text-gray-700'>{returnRequest.phone_number}</span></p></div>}
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                {((dayjs().isSame(dayjs(booking.fromDate), 'day') || dayjs().isBefore(dayjs(booking.fromDate), 'day')) &&
                    (!deliveryRequest)) && <div className='flex flex-col gap-2'>
                  <button onClick={()=>{handleDialogData(booking.user_location,booking.owner_location,booking.fromDate,booking.toDate,booking.booking_id,booking.car_id);setOpenDialog(!openDialog);}} className=" text-white bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Hire a Driver for Delivery</button>  
                </div>}
                {deliveryRequest?.booking_id===booking.booking_id && deliveryRequest?.status===null && deliveryRequest?.value==='Delivery' && <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>Delivery Request Pending</p>
                  </div>
                  <button onClick={()=>handleCancelDriver(deliveryRequest?.id)} className=" text-white bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cancel Delivery Request</button>  
                </div>}
                {deliveryRequest?.booking_id===booking.booking_id && (deliveryRequest?.status==="Accepted" || deliveryRequest?.status==="Completed") && deliveryRequest?.value==='Delivery' && <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{deliveryRequest?.status==='Accepted'?"Delivery Accepted":deliveryRequest?.status==='Completed'?"Car Delivered":''}</p>
                  </div>
                </div>}
                <div>
                {(dayjs().isSame(dayjs(booking.toDate), 'day') && 
                  !isNextDayBooked(booking.car_id, booking.toDate) && 
                  (!returnRequest || returnRequest.value!=='Return')) && <div className='flex flex-col gap-2'>
                  <button onClick={()=>{handleDialogData(booking.user_location,booking.owner_location,booking.fromDate,booking.toDate,booking.booking_id);setOpenReturnDialog(!openReturnDialog);}} className=" text-white bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Hire a Driver for Return</button>  
                </div>}
                {returnRequest?.booking_id===booking.booking_id && returnRequest?.status===null && returnRequest?.value==='Return' && <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>Return Request Pending</p>
                  </div>
                  <button onClick={()=>handleCancelDriver(returnRequest?.id)} className=" text-white bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cancel Return Request</button>  
                </div>}
                {returnRequest?.booking_id===booking.booking_id && (returnRequest?.status==="Accepted" || returnRequest?.status==="Completed") && returnRequest?.value==='Return' && <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{returnRequest?.status==='Accepted'?"Return Accepted":returnRequest?.status==='Completed'?"Car Returned":''}</p>
                  </div>
                </div>}
                </div>
                </div>
              </li>)
            })}
            <Dialog open={openDialog} onClose={()=>setOpenDialog(!openDialog)} maxWidth="md" fullWidth>
              <DialogTitle className='flex justify-center text-black'>Request Driver for Delivery</DialogTitle>
              <DialogContent>
                <div className='flex gap-4'>
                  <label>From: <input value={ownerPlace} readOnly className='border rounded-full p-2 focus:outline-none'/></label>
                  <label>To: <input value={userPlace} readOnly className='border rounded-full p-2 focus:outline-none'/></label>
                </div>
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>setOpenDialog(!openDialog)} color="secondary">
                  Cancel
              </Button>
              <Button onClick={()=>handleDriver("Delivery")} color="primary">
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>
        <Dialog open={openReturnDialog} onClose={()=>setOpenReturnDialog(!openReturnDialog)} maxWidth="md" fullWidth>
            <DialogTitle className='flex justify-center text-black'>Request Driver for Return</DialogTitle>
            <DialogContent>
              <div className='flex gap-4'>
                <label>From: <input value={userPlace} readOnly className='border rounded-full p-2 focus:outline-none'/></label>
                <label>To: <input value={ownerPlace} readOnly className='border rounded-full p-2 focus:outline-none'/></label>
              </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>setOpenReturnDialog(!openReturnDialog)} color="secondary">
                Cancel
            </Button>
            <Button onClick={()=>handleDriver("Return")} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </ul>}
        {val?.val==='carrentalposts' &&
        <ul className="list-none mt-3">
            {data.map((car) => (
              <li key={car.car_id} className="border p-4 mb-4 flex justify-between items-center">
                <img className='w-24 sm:w-32 object-cover mr-4' src={car.image_url}/>
                <div className='flex-1'>
                  <p className='text-gray-700 font-medium'>{car.brand} {car.model}</p>
                  <div className='flex gap-4'>
                    <p>Year: <span className='text-gray-700'>{car.year}</span></p>
                    <p>Rent: <span className='text-gray-700'>₹{car.rentFee}</span></p>
                    <p>Return Date: <span className='text-gray-700'>{new Date(car.date).toLocaleDateString("en-GB")}</span></p>
                  </div>
                  <div className='flex gap-4'>
                    <p>Location: <span className='text-gray-700'>{car.location}</span></p>
                    <p>Seats: <span className='text-gray-700'>{car.seats}</span></p>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <FaEdit onClick={()=>handleEditDialog(car.car_id)} className='w-5 h-5 text-green-700 cursor-pointer'/>
                  </div>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{car?.status==='accepted'?"Accepted":car?.status==='Submitted'?"Pending":''}</p>
                  </div>
                </div>
              </li>
            ))}
            <Dialog open={editDialog} onClose={()=>setEditDialog(!editDialog)} maxWidth="md" fullWidth>
              <p className='flex justify-center font-semibold text-[20px] mt-2 text-gray-800'>Update your Car</p>
                    <DialogContent>
                    {!cancel?<div className='mb-2'><label className='font-semibold'>Image</label>
                    <div className='flex items-center gap-3'>
                        <Link to={imageURL} target="_blank" className='text-blue-600 hover:underline'>View</Link>
                        <MdOutlineCancel onClick={()=>{setCancel(!cancel);setImageURL('');}} className="w-5 h-5 cursor-pointer text-gray-500"/>
                    </div></div>:<div><label className='font-semibold'>Upload Image</label>
                    <ImageUpload imageFile={imageFile} setImageFile={setImageFile}/></div>}
                    {!registrationCancel?<div className='mb-2'><label className='font-semibold'>Registration Certificate</label>
                    <div className='flex items-center gap-3'>
                        <Link to={registrationUrl} target="_blank" className='text-blue-600 hover:underline'>View</Link>
                        <MdOutlineCancel onClick={()=>{setRegistrationCancel(!registrationCancel);setRegistrationUrl('');}} className="w-5 h-5 cursor-pointer text-gray-500"/>
                    </div></div>:<div><label className='font-semibold'>Upload Registration Certificate</label>
                    <input type="file" onChange={(e)=>setEditRegistrationUrl(e.target.files[0])} accept="application/pdf" className='block w-80 py-3 px-0 text-lg text-gray-800 bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/></div>}
                    <div className='grid grid-cols-2 gap-4'>
                        <label className='font-semibold'>Car Brand<input onChange={(e)=>setBrand(e.target.value)} type='text' value={brand} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                        <label className='font-semibold'>Car Model<input onChange={(e)=>setModel(e.target.value)} type='text' value={model} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                        <label className='font-semibold'>Year<input onChange={(e)=>setYear(e.target.value)} type='number' value={year} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>                 
                        <label className='font-semibold'>Rent Price/Day<input onChange={(e)=>setRent(e.target.value)} type='number' value={rent} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                        <label className='font-semibold'>Seats<input onChange={(e)=>setSeats(e.target.value)} type='number' value={seats} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>                 
                        <label className='font-semibold'>Transmission<select value={transmission || ""} onChange={(e)=>setTransmission(e.target.value)} className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'"
                        >
                            {!transmission && <option value="">Select Transmission</option>}
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select></label>                 
                        <label className='font-semibold'>Location<input onChange={(e)=>setLocation(e.target.value)} type='text' value={location} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>    
                        <label className='font-semibold'>Fuel Type<select value={fuelType || ""} onChange={(e)=>setFuelType(e.target.value)} className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'"
                        >
                            {!fuelType && <option value="">Select Fuel Type</option>}
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                        </select></label>               
                        {fuelType==='Electric'?<label className='font-semibold'>Battery Capacity (kWh)<input onChange={(e)=>setFuelCapacity(e.target.value)} type='text' value={fuelCapacity} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>:
                        <label className='font-semibold'>Fuel Tank Capacity (L)<input onChange={(e)=>setFuelCapacity(e.target.value)} type='text' value={fuelCapacity} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label> }                
                        <label className='font-semibold'>{fuelType==='Electric'?'Mileage (km/kWh)':'Mileage (km/l)'}<input onChange={(e)=>setMileage(e.target.value)} type='number' value={mileage} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>                 
                        <div><LocalizationProvider dateAdapter={AdapterDayjs}>
                            <label className="font-semibold">Return Date</label>
                            <DatePicker value={returnDate} onChange={(newDate) => setReturnDate(newDate)} format="DD/MM/YYYY" disablePast
                                shouldDisableDate={(date) => dayjs(date).isBefore(originalReturnDate, 'day')}
                                slotProps={{ textField: {
                                    variant: "outlined",
                                    fullWidth: true,
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
                            </LocalizationProvider></div>
                        <label className='font-semibold'>Short Description<input onChange={(e)=>setDescription(e.target.value)} type='text' value={description} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>                 
                    </div>                
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>setEditDialog(!editDialog)} color="secondary">
                  Cancel
              </Button>
              <Button onClick={handleEditCarDialog} color="primary">
                  Update
              </Button>
              </DialogActions>
          </Dialog>
        </ul>}
        {val?.val==='carbooking' &&
        <ul className="list-none mt-3">
            {data.map((booking) => (
              <li key={booking.booking_id} className="border p-4 mb-4 flex justify-between items-center">
                <img className='w-24 sm:w-32 object-cover mr-4' src={booking.image_url}/>
                <div className='flex-1'>
                  <p>User: <span className='text-gray-700'>{booking.username}</span></p>
                  <p>Phone Number: <span className='text-gray-700'>{booking.phone_number}</span></p>
                  <p>Car: <span className='text-gray-700'>{booking.brand} {booking.model}</span></p>
                  <div className='flex gap-4'>
                    <p>From: <span className='text-gray-700'>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</span></p>
                    <p>To: <span className='text-gray-700'>{new Date(booking.toDate).toLocaleDateString("en-GB")}</span></p>
                  </div>
                  <div className='flex gap-4'>
                    <p>User Location: <span className='text-gray-700'>{booking.user_location}</span></p>
                    <p>Rent: <span className='text-gray-700'>₹{booking.rent}</span></p>
                  </div>
                </div>
              </li>
            ))}
        </ul>}
      </>):
      <h2 className='mt-12 text-center text-[16px] font-semibold'>
          No Bookings Yet!
      </h2>}
    </div>
  )
}

export default Bookings