import React from 'react';
import { Swiper,SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade,Autoplay } from 'swiper/modules';
import img1 from '../assets/auto-mechanic-using-diagnostic-tool-while-checking-car-battery-voltage-workshop_637285-4267.jpg'
import img2 from '../assets/professional-washer-blue-uniform-washing-luxury-car-with-water-gun-open-air-car-wash_496169-333.avif'
import img3 from '../assets/360_F_587768652_5KxxFho5EkKjDi9og9CVgGJClHet6mdH.jpg'
import img4 from '../assets/supply-of-used-cars-falls-with-slowdown-in-new-car-sales-may-trigger-price-hike.webp'
import img5 from '../assets/pexels-photo-164634.jpeg'
const slides=[
    {
        id:"Alert",
        title:'Need Immediate Assistance?',
        bg:img1,
        tag:'Find the nearest mechanic instantly using geolocation.',
        btnText:'Alert Mechanic',
        link:'/alert',
    },
    {
        id:"Car Wash",
        title:'Car Wash at Your Doorstep!',
        bg:img2,
        tag:'Book a car wash anytime, anywhere.',
        btnText:'Book Now',
        link:'/carwash',
    },
    {
        id:"Spare Parts",
        title:'Quality Spare Parts Delivered to You!',
        bg:img3,
        tag:'Browse, order, and get your parts delivered with ease.',
        btnText:'Buy Now',
        link:'/spareparts',
    },
    {
        id:"Price Prediction",
        title:'Sell Your Car at the Right Price!',
        bg:img4,
        tag:'Get accurate price predictions using our ML model.',
        btnText:'Get Price Prediction',
        link:'/price',
    },
    {
        id:"Car Rental",
        title:'Need a Ride? Rent a Car Effortlessly!',
        bg:img5,
        tag:'Affordable car rentals for all your needs.',
        btnText:'Rent a Car',
        link:'/rent',
    }
]

const Carousel = ({setActive}) => {
  return (
    <Swiper modules={[EffectFade,Autoplay]} effect={'fade'} Loop={true} autoplay={{
        delay:3000,disableOnInteraction:false,
    }}className='heroSlider h-[600px] lg:h-[860px]'>
        {slides.map((slide,index)=>{
            const {title,tag,bg,btnText,link}=slide
            return <SwiperSlide className='h-full bg-pink-400 relative flex justify-center items-center' key={index}>
                <div className='absolute z-20 inset-0 flex flex-col justify-center items-center text-white text-center'>
                    <h1 className='text-[32px] uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6'>{title}</h1>
                    <div className='uppercase tracking-[4px] mb-5'>{tag}</div>
                    <a href={link}><button className='text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
                     font-bold rounded-full text-xl px-12 py-3.5 text-center me-2 mb-2' onClick={()=>{setActive(slide.id)}}>{btnText}</button></a>
                </div>
                <div className='absolute top-0 w-full h-full'>
                    <img className='object-cover h-full w-full' src={bg} alt=""/>
                </div>
                <div className='absolute inset-0 bg-black/70'></div>
            </SwiperSlide>
        })}
    </Swiper>
  )
}

export default Carousel