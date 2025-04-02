import React, { useEffect, useState } from 'react'

const Reviews = () => {
    const name=localStorage.getItem('login');
    const id=localStorage.getItem('login_id');
    const [data,setData]=useState([]);
    const getData=async()=>{
        let url='';
        if(name==='Mechanic'){
            url=`http://localhost:5059/api/MechanicReview/Get1?mechanic_id=${id}`;
        }
        else if(name==='Car Wash Servicer'){
            url=`http://localhost:5059/api/CarWashReview/Get1?carwash_id=${id}`;
        }
        try{
            const response=await fetch(url);
            const data=await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div className='mt-48 mb-60'>
        <div className='text-4xl mt-5 border-b p-3 text-center flex gap-2 justify-center items-center'>
                <p className='text-gray-700 font-medium'>REVIEWS</p>
                <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
            </div>
        <div className="flex justify-center">
            <div className="w-[900px] mx-auto mt-20">
                <div className="flex flex-col gap-6">

                    {data.length>0?<>{data.map((review, index) => (
                    <div 
                        key={index}
                        className="bg-white p-4 border border-gray-300 rounded-lg shadow-md"
                    >
                        <div className='flex justify-between items-center'> 
                        <div className='flex-1'>
                            <p className="text-md font-semibold">{review.username}</p>
                        <p className="text-lg text-gray-800 font-medium">{review.review}</p>
                        </div>
                        </div>
                    </div>))}</>:<p className='flex items-center justify-center text-gray-700 font-medium text-2xl'>No reviews yet!</p>}
                </div>
            </div>
        </div>
    </div>)
}

export default Reviews