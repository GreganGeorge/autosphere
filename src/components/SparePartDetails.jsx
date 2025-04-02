import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar,FaStarHalfAlt,FaRegStar } from 'react-icons/fa'
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import toast from 'react-hot-toast';
import { useCart } from './CartContext';

const SparePartDetails = () => {
    const {id}=useParams();
    const {getCount}=useCart();
    const [title,setTitle]=useState('');
    const [brand,setBrand]=useState('');
    const [description,setDescription]=useState('');
    const [image,setImage]=useState('');
    const [price,setPrice]=useState();
    const [category,setCategory]=useState('');
    const [tab,setTab]=useState('description');
    const [rating,setRating]=useState([]);
    const [quantity,setQuantity]=useState(1);
    const login_id=localStorage.getItem('login_id');
    const [cart,setCart]=useState([]);
    const [fRating,setFRating]=useState("");
    const [hasRated,setHasRated]=useState(false);
    const [userRating, setUserRating] = useState(0);
    const [newReview,setNewReview]=useState("");
    const [reviews,setReviews]=useState([]);
    const getData=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get1?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setTitle(data[0].title);
          setBrand(data[0].brand);
          setDescription(data[0].description);
          setImage(data[0].image_url);
          setPrice(data[0].price);
          setCategory(data[0].category);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getRating=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get2?sparepart_id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setRating(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const handleQuantity=(val)=>{
        if(val==='minus'){
            if(quantity!==1){
                setQuantity(quantity-1);
            }
        }
        if(val==='plus'){
            setQuantity(quantity+1);
        }
    }
    const getCart=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get3?id=${login_id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setCart(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const handleCart=()=>{
        const isAdded = cart.some((item) => Number(item.sparepart_id) === Number(id) && Number(item.userid)===Number(login_id));
        if(isAdded){
            fetch(`http://localhost:5059/api/SpareParts/Put1?id=${id}&userid=${login_id}&quantity=${quantity}`,{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                })
                .then(res=>res.json())
                .then((result)=>{
                    toast.success("Added to the Cart!");
                    getCart();
                },(error)=>{
                    toast.error('Failed');
                })
        }
        else{
            fetch(`http://localhost:5059/api/SpareParts/Post1?id=${id}&userid=${login_id}&quantity=${quantity}`,{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success("Added to the Cart!");
                getCart();
                getCount();
            },(error)=>{
                toast.error("Error");
            })
        }
    }
    const handleRating=(value)=>{
        const userid=localStorage.getItem('login_id');
        if(value==="submit"){
        fetch(`http://localhost:5059/api/SpareParts/Post2?sparepart_id=${id}&userid=${userid}&rating=${userRating}`,{
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
                fetch(`http://localhost:5059/api/SpareParts/Put3?sparepart_id=${id}&userid=${userid}&rating=${fRating}`,{
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
        const url=`http://localhost:5059/api/SpareParts/Get6?sparepart_id=${id}&userid=${userid}`;
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
        fetch(`http://localhost:5059/api/SpareParts/Post3?sparepart_id=${id}&userid=${userid}&review=${newReview}&date=${date}`,{
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
        const url1=`http://localhost:5059/api/SpareParts/Get7?sparepart_id=${id}`;
        try{
            const response=await fetch(url1);
            const reviews=await response.json();
            setReviews(reviews)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleRemoveReview=(review_id)=>{
        fetch(`http://localhost:5059/api/SpareParts/Delete1?id=${review_id}`,{
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
    const handleRecommendation=async()=>{
        fetch(`http://localhost:5059/api/SpareParts/Post6?userid=${login_id}&category=${category}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log("Recommendation Added!");
        },(error)=>{
            toast.error("Error");
        })
    }
    useEffect(()=>{
        getData();
    },[id])
    useEffect(()=>{
        getRating();
        getCart();
        fetchUserRating();
        fetchReview();
    },[])
    useEffect(() => {
        const timer = setTimeout(() => {
          handleRecommendation();
        }, 20000);
        return () => clearTimeout(timer);
    }, [category]);
  return (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100 mt-36 mb-40">
    <div className=" gap-12 ml-60">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-20">
            <img src={image} alt={title} className="w-[550px] max-h-[400px] object-cover rounded-lg shadow-md hover:scale-[1.02] transition ease-in-out duration-300" />
            <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-xl mt-2 text-gray-800">{brand}</p>
                <p className="font-medium text-2xl mt-1 text-gray-800">{title}</p>
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
                <div className="flex w-32 mt-3 items-center justify-center px-1 py-1 gap-3 bg-gray-200 text-lg font-semibold border rounded-2xl">
                    <CiCircleMinus onClick={()=>handleQuantity('minus')} className="cursor-pointer text-red-700 text-2xl hover:text-red-900 transition duration-200" />
                    <span className="min-w-[20px] text-[18px] text-center">{quantity}</span>
                    <CiCirclePlus onClick={()=>handleQuantity('plus')} className="cursor-pointer text-green-700 text-2xl hover:text-green-900 transition duration-200" />
                </div>
                <p className="mt-5 text-[22px] text-gray-800 font-medium">₹{price}</p>
                <button onClick={handleCart} className='bg-green-600 text-white px-8 py-3 mt-4 text-sm font-medium active:bg-green-700 rounded-lg'>ADD TO CART</button>
            </div>
        </div>
    </div>
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

export default SparePartDetails