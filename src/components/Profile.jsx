import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
const Profile = () => {
    const [data1,setData]=useState([]);
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const getData=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/User/Get2?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          setName(data[0]?.username);
          setNumber(data[0]?.phone_number);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const update=()=>{
        const id = localStorage.getItem('login_id');
        fetch(`http://localhost:5059/api/User?id=${id}&username=${name}&phone_number=${number}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:id,
                username:name,
                phone_number:number
            })
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                getData();
            },(error)=>{
                toast.error('Failed');
            })
    }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div className='mr-20 mt-4'>
        <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
                id="username"
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
                type="text"
                value={number}
                onChange={(e)=>setNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
        </div>
        <button
            className="w-full px-4 py-2 text-base font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={update}
        >
            Save Changes
        </button>
    </div>
  )
}

export default Profile