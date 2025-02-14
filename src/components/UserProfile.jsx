import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import Bookings from './Bookings';
import Profile from './Profile';
const UserProfile = () => {
    const [data1,setData]=useState([]);
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [tab,setTab]=useState('bookings');
    const { logout} = useAuth(); 
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
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div className='max-w-[1170px] px-5 mx-auto mt-28 mb-60'>
        <div className='grid md:grid-cols-3 gap-10'>
            <div className='pb-[50px] px-[30px] rounded-md'>
                <div className='text-center mt-4'>
                    <h3 className='text-[18px] leading-[30px] text-black font-bold'>
                        {name}
                    </h3>
                    <p className='text-gray-600 text-[15px] leading-6 font-medium'>
                        {email}
                    </p>
                </div>
                <div className='mt-[50px] md:mt-[100px]'>
                    <button onClick={logout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Sign Out</button>
                </div>
            </div>
            <div className='md:col-span-2 md:px-[30px]'>
                <div>
                    <button onClick={()=>setTab('bookings')} className={`${tab==='bookings'&&'bg-green-600 text-white font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Mechanic Bookings</button>
                    <button onClick={()=>setTab('wbookings')} className={`${tab==='wbookings'&&'bg-green-600 text-white font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Car Wash Bookings</button>
                    <button onClick={()=>setTab('profile')} className={`${tab==='profile'&&'bg-green-600 text-white font-normal'} py-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7
                    border border-solid border-green-600`}>Profile</button>
                </div>
                {tab==='bookings'&&<Bookings val='mechanic'/>}
                {tab==='wbookings'&&<Bookings val='car wash'/>}
                {tab==='profile'&&<Profile/>}
            </div>
        </div>
    </div>
  )
}

export default UserProfile