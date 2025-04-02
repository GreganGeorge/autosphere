import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import {useNavigate } from 'react-router-dom';
import { FreeMode, Pagination } from "swiper/modules";
import { RxArrowTopRight } from "react-icons/rx";
import { useEffect, useState } from "react";
const Recommendation = () => {
    const [data,setData]=useState([]);
    const navigate=useNavigate();
    const getData=async()=>{
        const login_id=localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/SpareParts/Get12?id=${login_id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const uniqueData = [...new Map(data.map(item => [item.sparepart_id, item])).values()];
            setData(uniqueData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div>
    {data.length>2 && <div><p className="text-4xl font-semibold text-center px-3 mb-8 mt-20">Recommended Spare Parts</p>
    <div className="flex items-center justify-center flex-col h-[600px] bg-[#4488ac] rounded-3xl mx-40">
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="max-w-[90%] lg:max-w-[80%]"
      >
        {data.map((item) => (
          <SwiperSlide key={item.title}>
            <div onClick={() => navigate(`/sparepartdetails/${item.sparepart_id}`)} className="flex flex-col gap-6 mb-20 relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[215px] lg:h-[400px] lg:w-[350px] overflow-hidden cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center hover:scale-105 duration-300"
                style={{ backgroundImage: `url(${item.image_url})` }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                <h1 className="text-xl lg:text-2xl font-semibold">{item.title}</h1>
                <h1 className="lg:text-[18px]">₹{item.price}</h1>
            </div>          
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div></div>}
    </div>
  );
};

export default Recommendation;