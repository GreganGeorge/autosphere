import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import car from '../assets/tesla.png'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import ImageUpload from './ImageUpload';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from '../components/firebase';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { PiSteeringWheelFill } from "react-icons/pi";
import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { FaGasPump } from 'react-icons/fa6';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';


const CarRental = () => {
    const [business,setBusiness]=useState('');
    const [openModal,setOpenModal]=useState(false);
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
    const [battery,setBattery]=useState();
    const [mileage,setMileage]=useState();
    const [returnDate,setReturnDate]=useState();
    const [description,setDescription]=useState('');
    const [data,setData]=useState([]);
    const [filterLocation,setFilterLocation]=useState('');
    const [filterYear,setFilterYear]=useState();
    const [filterSeats,setFilterSeats]=useState();
    const [filterBrand,setFilterBrand]=useState('');
    const [filterModel,setFilterModel]=useState('');
    const [filterMileage,setFilterMileage]=useState();
    const [filterDate,setFilterDate]=useState();
    const [filteredData,setFilteredData]=useState([]);
    const [prevBookings,setPrevBookings]=useState([]);
    const [registrationCert,setRegistrationCert]=useState(null);
    const getData=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get6?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setBusiness(data[0]?.business);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getCars=async()=>{
        const url = `http://localhost:5059/api/CarRental/Get1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setData(data);
            setFilteredData(data);
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
    const checkInUse=(id)=>{
        const isCarInUse = prevBookings.some(booking => 
            booking.car_id === id &&
            dayjs().isBetween(dayjs(booking.fromDate), dayjs(booking.toDate), 'day', '[]')
          );
        return isCarInUse;
    }
    function capitalizeEachWord(text) {
        return text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }
    const handleSearch=async()=>{
        let newDate='';
        if(filterDate!==undefined){
            newDate=filterDate.format("YYYY-MM-DD")
        }
        const requestBody = {
            location: filterLocation,
            year: parseInt(filterYear) || 0,          
            seats: parseInt(filterSeats) || 0,
            brand:filterBrand,
            model: filterModel,
            mileage: parseInt(filterMileage) || 0,
            date: newDate,
        };
        try {
            const response = await fetch("http://localhost:5059/api/CarRental/Search", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                const data = await response.json();
                setFilteredData(data); 
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleAdd=async()=>{
        if(imageFile!==null && brand!=='' && model!=='' && fuelType!=='' && year && rent && seats && location!=='' && (fuelCapacity || battery) && returnDate && mileage && transmission!=='' && description!=='' && registrationCert!==null){
            const id = localStorage.getItem('login_id');
            const formattedDate = returnDate.format("YYYY-MM-DD");
            const uniqueImageName = `${uuidv4()}_${imageFile?.name}`;
            const imageNameRef = ref(storage, `carrental/${uniqueImageName}`);
            const imageNameSnapshot = await uploadBytesResumable(imageNameRef, imageFile);
            const imageNameURL = await getDownloadURL(imageNameSnapshot.ref);
            const encodedImageURL = encodeURIComponent(imageNameURL);
            const uniqueRegistrationProofName = `${uuidv4()}_${registrationCert.name}`;
            const RegistrationProofRef = ref(storage, `registrationproof/${uniqueRegistrationProofName}`);
            const RegistrationSnapshot = await uploadBytesResumable(RegistrationProofRef, registrationCert);
            const RegistrationProofURL = await getDownloadURL(RegistrationSnapshot.ref);
            const encodedRegistrationProofURL = encodeURIComponent(RegistrationProofURL);
            const newBrand=capitalizeEachWord(brand);
            const newModel=capitalizeEachWord(model);
            let url='';
            if(fuelType==='Electric'){
                url=`http://localhost:5059/api/CarRental/Post1?brand=${newBrand}&model=${newModel}&year=${year}&rentFee=${rent}&seats=${seats}&transmission=${transmission}&location=${location}&fuelType=${fuelType}&capacity=${battery}&mileage=${mileage}&date=${formattedDate}&description=${description}&image_url=${encodedImageURL}&userid=${id}&registration=${encodedRegistrationProofURL}`;
            }
            else{
                url=`http://localhost:5059/api/CarRental/Post1?brand=${newBrand}&model=${newModel}&year=${year}&rentFee=${rent}&seats=${seats}&transmission=${transmission}&location=${location}&fuelType=${fuelType}&capacity=${fuelCapacity}&mileage=${mileage}&date=${formattedDate}&description=${description}&image_url=${encodedImageURL}&userid=${id}&registration=${encodedRegistrationProofURL}`;
            }
            const response = await fetch(url, {
                method: 'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            toast.success("Car Added Successfully!");
            setBrand('');
            setModel('');
            setFuelType('');
            setYear();
            setRent();
            setSeats();
            setLocation('');
            setFuelCapacity();
            setBattery();
            setReturnDate();
            setMileage();
            setTransmission('');
            setDescription('');
            setImageFile(null);
            setRegistrationCert(null);
        }
        else{
            toast.error("Please fill all fields!")
        }
    }
    useEffect(()=>{
        getData();
        getCars();
        getPrevBooking();
    },[])
  return (
    <div className='mt-20 mb-20'>
        <div className='flex flex-col items-center p-10 py-20 gap-6 min-h-[450px] w-full'>
            <h2 className='text-[45px] font-medium text-purple-900'>Find Cars for Rent Near you</h2>
            <img src={car} className='mt-10'/>
            <div className='flex justify-between text-base sm:text-3xl mb-4 mt-6'>
                <div className='inline-flex gap-2 items-center mb-3'>
                    <p className='text-purple-800 text-5xl'>Cars<span className='text-purple-900 font-medium'> Catalog</span></p>
                    <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-purple-900'></p>
                </div>
            </div>
            <div className='flex items-center gap-10 justify-center'>
                <div className='flex bg-white p-4 rounded-full gap-4 shadow-md mt-3'>
                    <input placeholder='Pickup Location' onChange={(e)=>setFilterLocation(e.target.value)} value={filterLocation} className='border border-gray-300 rounded-full p-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500'/>
                    <select value={filterYear || ""} onChange={(e)=>setFilterYear(e.target.value)} className="p-2 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {<option value="">Select Year</option>}
                        {[...new Set(data.map((item)=>item.year))].map((year)=>(
                            <option value={year}>{year}</option>)
                        )}
                    </select> 
                    <select value={filterSeats || ""} onChange={(e)=>setFilterSeats(e.target.value)} className="p-2 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {<option value="">Select Seats</option>}
                        {[...new Set(data.map((item)=>item.seats))].map((seat)=>(
                            <option value={seat}>{seat}</option>)
                        )}
                    </select>           
                    <select value={filterBrand || ""} onChange={(e)=>setFilterBrand(e.target.value)} className="p-2 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {<option value="">Select Brand</option>}
                        {[...new Set(data.map((item)=>item.brand))].map((brand)=>(
                            <option value={brand}>{brand}</option>)
                        )}
                    </select>  
                    <select value={filterModel || ""} onChange={(e)=>setFilterModel(e.target.value)} className="p-2 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {<option value="">Select Model</option>}
                        {[...new Set(data.map((item)=>item.model))].map((model)=>(
                            <option value={model}>{model}</option>)
                        )}
                    </select>
                    <select value={filterMileage || ""} onChange={(e)=>setFilterMileage(e.target.value)} className="p-2 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        <option value="">Select Mileage</option>
                        <option value="10">10+</option>
                        <option value="15">15+</option>
                        <option value="20">20+</option>
                    </select>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker value={filterDate} onChange={(newDate) => setFilterDate(newDate)} format="DD/MM/YYYY" disablePast
                            slotProps={{ textField: {
                                variant: "outlined",
                                fullWidth: true,
                                placeholder: "Return Date",
                                InputProps: {
                                    sx: {
                                        borderRadius: "999px",
                                        borderColor: "gray.300",
                                        color: "gray.500",
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "purple.500",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "purple.500",
                                            boxShadow: "none", 
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "gray.300",
                                        },
                                        fontSize: "0.875rem",
                                    },
                                },                               
                            },
                            }}
                        />
                        </LocalizationProvider>
                    </div>
                    <IoSearch onClick={handleSearch} className='text-[45px] cursor-pointer bg-purple-600 text-white rounded-full p-3 hover:scale-105 transition-all'/>
                </div>
                {business==='Yes'?<div onClick={()=>setOpenModal(!openModal)} className='bg-purple-600 rounded-lg text-white p-4 font-medium mt-3 cursor-pointer hover:scale-105 duration-150 shadow-md'>
                    <p>Add a Car for Rent</p>
                </div>:''}
                <Dialog open={openModal} onClose={()=>setOpenModal(!openModal)} maxWidth="md" fullWidth>
                    <p className='flex justify-center font-semibold text-[20px] mt-2 text-gray-800'>Add a Car for Rent</p>
                    <DialogContent>
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
                        {fuelType==='Electric'?<label className='font-semibold'>Battery Capacity (kWh)<input onChange={(e)=>setBattery(e.target.value)} type='text' value={battery} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>:
                        <label className='font-semibold'>Fuel Tank Capacity (L)<input onChange={(e)=>setFuelCapacity(e.target.value)} type='text' value={fuelCapacity} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label> }                
                        <label className='font-semibold'>{fuelType==='Electric'?'Mileage (km/kWh)':'Mileage (km/l)'}<input onChange={(e)=>setMileage(e.target.value)} type='number' value={mileage} className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>                 
                        <div><LocalizationProvider dateAdapter={AdapterDayjs}>
                            <label className="font-semibold">Return Date</label>
                            <DatePicker value={returnDate} onChange={(newDate) => setReturnDate(newDate)} format="DD/MM/YYYY" disablePast
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
                    <label className='font-semibold'>Upload Image
                    <ImageUpload imageFile={imageFile} setImageFile={setImageFile}/></label>
                    <label className='font-semibold'>Upload Registration Certificate
                    <input type="file" onChange={(e)=>setRegistrationCert(e.target.files[0])} accept="application/pdf" className='block w-80 py-3 px-0 text-lg text-gray-800 bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/></label>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>setOpenModal(!openModal)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4'>
            {filteredData.map((car)=>(
                <div className='group relative bg-gray-50 p-2 sm:p-5 rounded-3xl m-1 sm:m-5 hover:bg-white hover:border-[1px] cursor-pointer
                border-purple-500 hover:scale-105 duration-150 shadow-md'>
                    {checkInUse(car.car_id) ?<div className="ribbon absolute -top-2 -right-2 h-40 w-40 overflow-hidden 
                        before:absolute before:top-0 before:left-0 before:-z-[1] before:border-4 before:border-purple-500 
                        after:absolute after:right-0 after:bottom-0 after:-z-[1] after:border-4 after:border-purple-500">
                        <div className="absolute -right-14 top-[43px] w-60 rotate-45 bg-gradient-to-br from-purple-700 via-purple-500 to-purple-700 py-2.5 text-center text-white shadow-md">
                            In Use
                        </div>
                    </div>:''}
                    <h2 className='text-[20px] font-medium mb-2'>{car.brand} {car.model}</h2>
                    <h2 className='text-[28px] font-bold mb-2'>
                        <span className='text-[12px] font-light'>₹ </span>
                        {car.rentFee}
                        <span className='text-[12px] font-light'> /day</span>
                    </h2>
                    <img src={car.image_url} alt={car.brand} width={220} height={200} className='w-[250px] h-[150px] mb-3 object-contain'/> 
                    <div className='flex justify-around group-hover:hidden'>
                        <div className='text-center text-gray-500'>
                            <PiSteeringWheelFill className='w-full text-[22px] mb-2 text-purple-700'/>
                            <h2 className='line-clamp-5 text-[14px] font-light'>{car.transmission}</h2>
                        </div>
                        <div className='text-center text-gray-500'>
                            <MdAirlineSeatReclineNormal className='w-full text-[22px] mb-2 text-orange-700'/>
                            <h2 className='line-clamp-5 text-[14px] font-light'>{car.seats} Seats</h2>
                        </div>
                        <div className='text-center text-gray-500'>
                            <FaGasPump className='w-full text-[22px] mb-2 text-green-700'/>
                            <h2 className='line-clamp-5 text-[14px] font-light'>{car.fuelType==='Electric'?`${car.mileage} km/kWh`:`${car.mileage} km/l`}</h2>
                        </div>
                    </div>
                    <Link to={`/rent/${car.car_id}`} className='hidden group-hover:flex bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800
                    p-2 rounded-lg text-white w-full px-5 justify-between cursor-pointer hover:scale-105 duration-150'>Rent Now<FaLongArrowAltRight className='flex items-center justify-center w-6 h-6'/>
                    </Link>
                </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default CarRental