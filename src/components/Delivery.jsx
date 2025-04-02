import React, { useEffect, useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import getStripe from './getStripe'
import axios from 'axios';

const Delivery = () => {
    const location=useLocation();
    const {value}=location.state || {};
    const [total,setTotal]=useState();
    const [found,setFound]=useState(false);
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [pincode,setPincode]=useState();
    const [locality,setLocality]=useState('');
    const [address,setAddress]=useState('');
    const [district,setDistrict]=useState('');
    const [state,setState]=useState('');
    const login_id=localStorage.getItem('login_id');
    const [cart,setCart]=useState([]);
    const getDetails=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get9?id=${login_id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if(data.length>0){
                setFound(true);
                setName(data[0]?.name);
                setNumber(data[0]?.number);
                setPincode(data[0]?.pincode);
                setLocality(data[0]?.locality);
                setAddress(data[0]?.address);
                setDistrict(data[0]?.district);
                setState(data[0]?.state);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleDetails=()=>{
        if(name!=='' && number!=='' && pincode && locality!=='' && address!=='' && district!=='' && state!==''){
        const requestBody = {
            name: name,
            number: number,          
            pincode: pincode,
            locality:locality,
            address: address,
            district: district,
            state: state,
            login_id:login_id
        };
        if(!found){
            fetch(`http://localhost:5059/api/SpareParts/Post4`,{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(requestBody),
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log("Submitted!");
            },(error)=>{
                toast.error("Error");
            })
        }
        else{
            fetch(`http://localhost:5059/api/SpareParts/Put4`,{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(requestBody),
                })
                .then(res=>res.json())
                .then((result)=>{
                    console.log('updated');
                },(error)=>{
                    toast.error('Failed');
                })
        }
        }
        else{
            toast.error("Please fill all fields");
        }
    }
    const getCart=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get4?id=${login_id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleProceed=async()=>{
        if(cart.length>0){
            try { 
                const stripe = await getStripe(); 
                const response = await axios.post('http://localhost:5059/api/stripe/product-session',cart, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${'pk_test_51P2BgZSAzlT6XHrmRqB6GtO9EsXpgACjyDyyXoe27XlLTUcJOoOr7ZL2jIUplaw1tiFA6P555aBeJcVDG4ymKkR100PcI3TmGD'}`
                    }
                });
                const { sessionId } = response.data;
                toast.loading('Redirecting to checkout...');
                localStorage.setItem("productBookingDetails",JSON.stringify(cart))
                localStorage.setItem("status","product");
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
        getDetails();
        getCart();
    },[])
    useEffect(()=>{
        setTotal(value);
    },[value])
  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t mt-28 px-20'>
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
            <div className='text-xl sm:text-2xl my-3'>
            <div className='inline-flex gap-2 items-center mb-6'>
                <p className='text-gray-700 text-3xl'>DELIVERY<span className='text-gray-700 font-medium'> INFORMATION</span></p>
                <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
            </div>
            </div>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder='Name'/>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={number} onChange={(e)=>setNumber(e.target.value)} type='number' placeholder='Mobile number'/>
            <div className='flex gap-3'>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={pincode} onChange={(e)=>setPincode(e.target.value)} type='number' placeholder='Pincode'/>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={locality} onChange={(e)=>setLocality(e.target.value)} type='text' placeholder='Locality'/>
            </div>
            <textarea rows={3} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={address} onChange={(e)=>setAddress(e.target.value)} type='text' placeholder='Address'></textarea>
            <div className='flex gap-3'>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={district} onChange={(e)=>setDistrict(e.target.value)} type='text' placeholder='District'/>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:ring-green-500 focus:border-green-500' value={state} onChange={(e)=>setState(e.target.value)} type='text' placeholder='State'/>
            </div>
        </div>
        <div className='mt-8'>
            <div className='mt-8 min-w-80'>
                <div className='flex justify-end my-20'>
                    <div className='w-full sm:w-[450px]'>
                        <div className='w-full'>
                            <div className='text-2xl'>
                                <div className='inline-flex gap-2 items-center mb-6'>
                                    <p className='text-gray-700 text-3xl'>CART<span className='text-gray-700 font-medium'> TOTAL</span></p>
                                    <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                                </div>
                            </div>
                            <div className='flex flex-col mt-2 text-sm'>
                                <div className='flex gap-3 font-medium text-[20px]'>
                                    <p>Total</p>
                                    <p>-</p>
                                    <p>₹{total}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full mt-8'>
                            <button onClick={()=>{handleDetails();handleProceed();}} className="text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-md text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">PROCEED TO PAYMENT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Delivery