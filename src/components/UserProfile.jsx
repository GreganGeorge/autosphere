import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import Bookings from './Bookings';
import Profile from './Profile';
import { Switch } from '@mui/material';
import toast from 'react-hot-toast';
import { styled } from "@mui/material/styles";

const UserProfile = () => {
    const [data1,setData]=useState([]);
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [tab,setTab]=useState('bookings');
    const [business,setBusiness]=useState('');
    const { logout} = useAuth(); 
    const [count,setCount]=useState([]);
    const getData=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get2?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          setName(data[0]?.username);
          setEmail(data[0]?.email);
          setNumber(data[0]?.phone_number);
          setBusiness(data[0]?.business);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getCount=async()=>{
        const value=localStorage.getItem('login');
        const id=localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get7?id=${id}&value=${value}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setCount(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const GreenSwitch = styled(Switch)({
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "green",
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: "green",
        },
      });
    const handleToggle=async(val)=>{
        const id = localStorage.getItem('login_id');
        let url='';
        if(val===true){
            url=`http://localhost:5059/api/User/Put4?value=Yes&userid=${id}`;
        }
        else if(val===false){
            url=`http://localhost:5059/api/User/Put4?value=No&userid=${id}`
        }
        fetch(url,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                getData();
            },(error)=>{
                toast.error('Failed');
            })
        
    }
    useEffect(()=>{
        getData();
        getCount();
    },[])
  return (
    <div className='max-w-[1250px] px-5 mx-auto mt-40 mb-60'>
        <div className='grid md:grid-cols-3 gap-10'>
            <div className='pb-[50px] px-[30px] rounded-md'>
                <div className='text-center mt-4'>
                    <h3 className='text-[18px] leading-[30px] text-black font-bold'>
                        {name}
                    </h3>
                    <p className='text-gray-600 text-[15px] leading-6 font-medium'>
                        {email}
                    </p>
                    <p className='text-gray-600 text-[15px] leading-6 font-medium'>
                        Answer Upvotes Received : {count[0]?.count}
                    </p>
                    <div className='bg-green-100 rounded-full flex items-center p-2 justify-center mt-6'>
                        {business==='No'?<p className='text-[16px] font-medium text-gray-900'>Switch to Business Account</p>:<p className='text-[16px] font-medium text-gray-900'>Business Account</p>}
                        <GreenSwitch checked={business === "Yes"} onChange={(e) => handleToggle(e.target.checked)}/>
                    </div>
                </div>
                <div className='mt-[50px] md:mt-[100px]'>
                    <button onClick={logout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Sign Out</button>
                </div>
            </div>
            <div className='md:col-span-2 md:px-[20px]'>
                <div>
                    <button onClick={()=>setTab('bookings')} className={`${tab==='bookings'&&'bg-green-600 text-white font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Mechanic Bookings</button>
                    <button onClick={()=>setTab('wbookings')} className={`${tab==='wbookings'&&'bg-green-600 text-white font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Car Wash Bookings</button>
                    <button onClick={()=>setTab('spareparts')} className={`${tab==='spareparts'&&'bg-green-600 text-white font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Spare Parts Orders</button>
                    <button onClick={()=>setTab('carrental')} className={`${tab==='carrental'&&'bg-green-600 text-white font-normal'} py-2 mr-5 mt-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Car Rental Bookings</button>
                    <button onClick={()=>setTab('carrentalposts')} className={`${tab==='carrentalposts'&&'bg-green-600 text-white font-normal'} py-2 mr-5 mt-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Car Rental Posts</button>
                    <button onClick={()=>setTab('carbooking')} className={`${tab==='carbooking'&&'bg-green-600 text-white font-normal'} py-2 mr-5 mt-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Your Car Bookings</button>
                    <button onClick={()=>setTab('profile')} className={`${tab==='profile'&&'bg-green-600 text-white font-normal'} py-2 px-5 mt-2 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Profile</button>
                </div>
                {tab==='bookings'&&<Bookings val='mechanic'/>}
                {tab==='wbookings'&&<Bookings val='car wash'/>}
                {tab==='spareparts'&&<Bookings val='spareparts'/>}
                {tab==='carrental'&&<Bookings val='carrental'/>}
                {tab==='carrentalposts'&&<Bookings val='carrentalposts'/>}
                {tab==='carbooking'&&<Bookings val='carbooking'/>}
                {tab==='profile'&&<Profile/>}
            </div>
        </div>
    </div>
  )
}

export default UserProfile