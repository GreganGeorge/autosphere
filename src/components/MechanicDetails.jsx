import React, { useEffect, useState } from 'react'
import { useParams,useLocation } from 'react-router-dom'
import verified from '../assets/verified-vector-icon-account-verification-verification-icon_564974-1246-removebg-preview (2).png'
import { FaStar,FaStarHalfAlt,FaRegStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import getStripe from './getStripe'
import axios from 'axios'

const MechanicDetails = () => {
    const {id}=useParams();
    const [data,setData]=useState([]);
    const [data1,setData1]=useState([]);
    const [reviews,setReviews]=useState([]);
    const location=useLocation();
    const {travelTime}=location.state || {};
    const [userRating, setUserRating] = useState(0);
    const [newReview,setNewReview]=useState("");
    const [fRating,setFRating]=useState("");
    const [hasRated,setHasRated]=useState(false);
    const [userLocation,setUserLocation]=useState([]);
    const handleRatingChange = (e) => {
        setUserRating(parseFloat(Number(e.target.value).toFixed(1)));
    };    
    const fetchData=async()=>{
        const url = `http://localhost:5059/api/User/Get3?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchRating=async()=>{
        const url1=`http://localhost:5059/api/MechanicRating/Get1?mechanic_id=${id}`;
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
        fetch(`http://localhost:5059/api/MechanicReview?mechanic_id=${id}&userid=${userid}&review=${newReview}&date=${date}`,{
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
        const url1=`http://localhost:5059/api/MechanicReview/Get1?mechanic_id=${id}`;
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
        fetch(`http://localhost:5059/api/MechanicReview?id=${review_id}`,{
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
        fetch(`http://localhost:5059/api/MechanicRating?mechanic_id=${id}&userid=${userid}&rating=${userRating}`,{
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
                fetch(`http://localhost:5059/api/MechanicRating/Put1?mechanic_id=${id}&userid=${userid}&rating=${fRating}`,{
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
        const url=`http://localhost:5059/api/MechanicRating/Get2?mechanic_id=${id}&userid=${userid}`;
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
    const fetchUserLocation=async()=>{
        const userid=localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get4?id=${userid}`;
        try {
          const response = await fetch(url);
          const loc = await response.json();
          setUserLocation(loc);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleBook=async()=>{
        const userid=localStorage.getItem('login_id');
        try { 
            const stripe = await getStripe(); 
            const response = await axios.post('http://localhost:5059/api/stripe/mechanic-session', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${'pk_test_51P2BgZSAzlT6XHrmRqB6GtO9EsXpgACjyDyyXoe27XlLTUcJOoOr7ZL2jIUplaw1tiFA6P555aBeJcVDG4ymKkR100PcI3TmGD'}`
                }
            });
            const { sessionId } = response.data;
            toast.loading('Redirecting to checkout...');
            {data.map((mechanic)=>{
                const name=mechanic.username;
                const place=mechanic.place;
                const location=userLocation[0].location;
                localStorage.setItem("bookingDetails",JSON.stringify({id,name,place,userid,travelTime,location}))
                localStorage.setItem("status","mechanic");
            })}
            stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error('Error creating checkout session. Please try again later.');
        }
    }
    useEffect(()=>{
        fetchData();
        fetchUserLocation();
        fetchRating();
        fetchReview();
        fetchUserRating();
    },[])
  return (
    <div className="flex flex-col justify-between items-center mt-40 mb-60">
        {data.map((mechanic)=>(
            <div className='flex items-start flex-col justify-center border border-gray-400 rounded-lg p-10 py-7 bg-white mt-[-80px] sm:mt-0 w-[40%]'>
                <p className='flex items-center justify-between gap-1 text-2xl font-medium text-gray-900'>{mechanic.username} <img src={verified} height={25} width={25}/></p>
                <p>Travel Time: {travelTime} min</p>
                <p>Contact: {mechanic.phone_number}</p>
                <p>Place: {mechanic.place}</p>
                <p>About: {mechanic.about}</p>
                <p className='text-gray-700 font-medium mt-1'>Booking Fee: <span className='text-black'>₹50</span> (Additional charges may apply depending on the service)</p>
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
                <button onClick={handleBook} className="self-center text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Book</button>
            </div>
        ))}
        <div className="flex items-start flex-col justify-center border border-gray-400 rounded-lg p-56 py-20 bg-white mt-4 w-[40%]">
            {!hasRated?<div className='self-center'><p className=" text-xl font-medium mb-4">Rate the Mechanic</p>
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

export default MechanicDetails