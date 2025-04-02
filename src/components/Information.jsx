import React, { useState } from 'react';
import { GiMechanicGarage } from "react-icons/gi";
import { MdLocalCarWash } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePriceChange } from "react-icons/md";
import { MdCarRental } from "react-icons/md";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import img1 from '../assets/smiling-auto-mechanic-with-wrench-standing-hands-folded-white-background.png';
import img2 from '../assets/front-view-male-worker-uniform-carrying-suitcase-with-tools-white-wall.png';
import img3 from '../assets/pngwing.com (3).png';
import Recommendation from './Recommendation';

const data=[
    {
        id:"Alert",
        text:'Alert Mechanic',
        title:"Alert Nearby Mechanic",
        description:"Get instant help when your vehicle breaks down. Find a nearby mechanic based on your current location. Our geolocation-based alerts ensure fast assistance, minimizing downtime and inconvenience.",
        btnText:'Alert Mechanic',
        link:'/alert',
        color:'green',
        image:img1,
    },
    {
        id:"Car Wash",
        text:'Car Wash Service',
        title:"Car Wash Service",
        description:"Keep your car spotless without leaving your home. Book a car wash at your location at your convenience. Our professional car wash service ensures your vehicle looks its best, inside and out.",
        btnText:'Book Now',
        link:'/carwash',
        color:'red',
        image:img2,
    },
    {
        id:"Spare Parts",
        text:'Spare Parts',
        title:"Spare Parts",
        description:"Find and order high-quality vehicle parts for all your repair needs. From engines to brake pads, we offer a wide variety of parts to keep your vehicle running smoothly.",
        btnText:'Buy Now',
        link:'/spareparts',
        color:'teal',
        image:img3,
    },
]
const ServicesData=[
    {
        click:'Alert',
        id:1,
        title:'Alert Mechanic',
        link:'/alert',
        icon:<GiMechanicGarage />,
        delay:0.2,
    },
    {
        click:"Car Wash",
        id:2,
        title:'Car Wash Service',
        link:'/carwash',
        icon:<MdLocalCarWash />,
        delay:0.3,
    },
    {
        click:"Spare Parts",
        id:3,
        title:'Spare Parts',
        link:'/spareparts',
        icon:<IoSettingsOutline />,
        delay:0.4,
    },
    {
        click:"Price Prediction",
        id:4,
        title:'Price Prediciton',
        link:'/price',
        icon:<MdOutlinePriceChange />,
        delay:0.5,
    },
    {
        click:"Car Rental",
        id:5,
        title:'Rental Service',
        link:'/rent',
        icon:<MdCarRental />,
        delay:0.6,
    }
]
const SlideLeft=(delay)=>{
    return{
        initial:{
            opacity:0,
            x:50,
        },
        animate:{
            opacity:1,
            x:0,
            transition:{
                duration:0.3,
                delay:delay,
                ease:'easeInOut',
            },
        },
    }
}
const Information = ({setActive}) => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [message,setMessage]=useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleMessage=()=>{
        if(name===''||email===''||message===''){
            toast.error("Please fill all fields!")
        }
        else if (!emailRegex.test(email)) {
            toast.error("Invalid email format!");
        }
        else{
            fetch(`http://localhost:5059/api/Suggestion?name=${name}&email=${email}&message=${message}`,{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:name,
                    email:email,
                    message:message
                })
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success("Message Sent Successfully");
                setName('');
                setEmail('');
                setMessage('')
            },(error)=>{
                toast.error("Error");
            })
        }
    }
  return (
    <div className='pb-14 pt-16'>
        <h1 className='flex justify-center text-5xl font-bold text-left pb-10'>Services</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mx-40'>
            {ServicesData.map((service)=>(
                <a href={service.link} onClick={()=>{setActive(service.click)}}><motion.div variants={SlideLeft(service.delay)} initial="initial" whileInView={"animate"} viewport={{once:true}}
                className='bg-[#e0dede] rounded-2xl flex flex-col gap-4 items-center justify-center
                p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl'>
                    <div className='text-4xl mb-4'>{service.icon}</div>
                    <h1 className='text-lg font-semibold text-center px-3'>{service.title}</h1>
                </motion.div></a>
            ))}
        </div>
        <Recommendation/>
        {data.map((value)=>(
            <div>
            <h1 className='flex justify-center text-5xl font-bold text-left pb-10 mt-20'>{value.text}</h1>
            <p className="text-justify px-5 md:px-20 text-2xl font-semibold leading-relaxed mb-8 text-gray-700 mx-60">{value.description}</p>
            <div className='flex justify-center items-center py-12 mx-40'>
                <div>
                    <div style={{backgroundColor:value.color}} className='grid grid-cols-1 md:grid-cols-3 h-[380px] gap-6 items-center text-white rounded-3xl overflow-hidden'>
                        <div className='p-6 sm:p-8'>
                            <h1 className='uppercase text-4xl lg:text-7xl font-bold'>{" "}{value.title}</h1>
                        </div>
                        <div className='flex items-center'>
                            <img src={value.image} alt="" className='scale-100 drop-shadow-2xl'/>
                        </div>
                        <div className='flex flex-col justify-center gap-4 p-6 sm:p-8'>
                            <a href={value.link}><button onClick={()=>{setActive(value.id)}} className={`text-white bg-gradient-to-r ${value.color === 'green'
                            ? 'from-green-500 via-green-600 to-green-700 focus:ring-green-300 dark:focus:ring-green-800'
                            : value.color === 'red'
                            ? 'from-red-500 via-red-600 to-red-700 focus:ring-red-300 dark:focus:ring-red-800'
                            : value.color === 'teal'
                            ? 'from-teal-500 via-teal-600 to-teal-700 focus:ring-teal-300 dark:focus:ring-teal-800'
                            : ''} hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-bold rounded-full 
                            text-xl px-12 py-3.5 text-center me-2 mb-2`}>{value.btnText}</button></a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        ))}
        <h1 className='flex justify-center text-5xl font-bold text-left pb-10 mt-20'>Contact Us</h1>
        <div className='flex justify-center'>
            <form className='w-full max-w-xl'>
                <div className='mb-4'>
                    <label className='block text-black text-md font-semibold mb-2'>Name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-3 border rounded-lg bg-gray-300 focus:border-blue-500" type="text"/>
                </div>
                <div className='mb-4'>
                    <label className='block text-black text-md font-semibold mb-2'>Email</label>
                    <input value={email} type="email" onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-3 border rounded-lg bg-gray-300 focus:border-blue-500" required/>
                </div>
                <div className='mb-4'>
                    <label className='block text-black text-md font-semibold mb-2'>Message</label>
                    <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows='6' className="w-full px-3 py-3 border rounded-lg bg-gray-300 focus:border-blue-500" type="text"/>
                </div>
                <div className='flex justify-center'>
                    <button type="button" onClick={handleMessage} className=" text-white mt-1 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-md px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Send Message</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Information