import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import {runFireworks} from './Utils.jsx'
import axios from 'axios';

const Success = () => {
    const status=localStorage.getItem("status");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        runFireworks();
        if(status==='mechanic'){
            const storedDetails = JSON.parse(localStorage.getItem("bookingDetails"));
            if (storedDetails) {
                setBookingDetails(storedDetails);
                const now = new Date();
                setCurrentDate(now.toISOString().split("T")[0]);
                setCurrentTime(now.toTimeString().split(" ")[0]);
            }
        }
        if(status==='servicer'){
            const storedDetails = JSON.parse(localStorage.getItem("servicerBookingDetails"));
            if (storedDetails) {
                setBookingDetails(storedDetails);
            }
        }
    }, []);
    const saveBookingDetails = async () => {
        if (bookingDetails && status==='mechanic') {
            try {
                const payload = {
                    userId: bookingDetails.userid,
                    mechanic_id:bookingDetails.id,
                    mechanic_name: bookingDetails.name,
                    place: bookingDetails.place,
                    travel_time: bookingDetails.travelTime,
                    date: currentDate,
                    time: currentTime,
                    location: bookingDetails.location,
                    fee:50
                };
                const response = await axios.post(
                    "http://localhost:5059/api/Booking/create",
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Booking saved successfully:", response.data);
            } catch (error) {
                console.error("Error saving booking details:", error);
            }
            fetch(`http://localhost:5059/api/Mechanic/Put1?mechanic_id=${bookingDetails.id}`,{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    id:bookingDetails.id
                })
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log("Updated Availability!");
            },(error)=>{
                console.log("Error");
            })
        }
        else if(bookingDetails && status==='servicer'){
            try {
                const payload = {
                    userId: bookingDetails.userid,
                    carwash_id:bookingDetails.id,
                    carwash_name: bookingDetails.name,
                    place: bookingDetails.place,
                    selectedServices: bookingDetails.selectedServices,
                    servicerPlace:bookingDetails.servicerPlace,
                    date: bookingDetails.selectedDate,
                    time: bookingDetails.selectedTime
                };
                const response = await axios.post(
                    "http://localhost:5059/api/Booking/Post1",
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Booking saved successfully:", response.data);
            } catch (error) {
                console.error("Error saving booking details:", error);
            }
        }
    };

    useEffect(() => {
        if (bookingDetails) {
            saveBookingDetails();
        }
    }, [bookingDetails]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Thank you for your booking!</h2>
            <Link to="/profile">
            <button
                type="button"
                className="w-64 py-3 mt-2 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                Check Booking
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Success