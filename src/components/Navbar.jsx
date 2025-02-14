import React,{useEffect, useState} from 'react';
import { Link,useLocation,useNavigate} from 'react-router-dom';
import {navLinks} from '../constants';
import menu from '../assets/menu.svg'
import close from '../assets/close.svg'
import { useAuth } from './AuthContext';
const Navbar = ({active,setActive}) => {
    const [toggle,setToggle]=useState(false);
    const [header,setHeader]=useState(false);
    const navigate=useNavigate();
    const { loggedIn, logout,login } = useAuth(); 
    const location=useLocation();
    const name = localStorage.getItem('login');
    const mechLinks=[
        {
            id: "home",
            title: "Home",
            link:'/',
        },
        {
            id: "profile",
            title: "Profile",
            link:'/mechprofile',
        },
        {
            id: "review",
            title: "Reviews",
            link:'/reviews',
        },
        {
            id: "q&a",
            title: "Q&A",
            link:'/q&a',
        },
    ]
    const carWashLinks=[
        {
            id: "home",
            title: "Home",
            link:'/',
        },
        {
            id: "profile",
            title: "Profile",
            link:'/carwashprofile',
        },
        {
            id: "review",
            title: "Reviews",
            link:'/reviews',
        },
        {
            id: "faq",
            title: "FAQ",
            link:'/faq',
        }
    ]
    useEffect(()=>{
        window.addEventListener('scroll',()=>{
            window.scrollY>50?setHeader(true):setHeader(false);
        })
    const currentPath = location.pathname;
    if (currentPath === '/') {
      setActive('Home');
    } else if (currentPath === '/alert') {
      setActive('Alert');
    } else if (currentPath === '/carwash') {
      setActive('Car Wash');
    } else if (currentPath === '/spareparts') {
      setActive('Spare Parts');
    } else if (currentPath === '/price') {
      setActive('Price Prediction');
    } else if (currentPath === '/rent') {
      setActive('Car Rental');
    } else if (currentPath === '/login') {
      setActive('');
    } else if (currentPath === '/profile') {
        setActive('');
    }else if (currentPath === '/mechprofile') {
        setActive('Profile');
    }else if (currentPath === '/reviews') {
        setActive('Reviews');
    }else if (currentPath === '/faq') {
        setActive('FAQ');
    }else if (currentPath === '/carwashprofile') {
        setActive('Profile');
    }else if (/^\/mechanic\/\d+$/.test(currentPath)) {
      setActive('mechanic');
    }else if (currentPath === '/success') {
      setActive('success');
    }else if (/^\/carwash\/\d+$/.test(currentPath)) {
      setActive('car wash details');
    }else if (currentPath === '/q&a') {
      setActive('Q&A');
  }
    
  }, [location, setActive]);
  return (
    <>
    {(name==='User' || name===null) && (<nav className={`${active==='Home' && !header ?' bg-transparent py-8':'bg-black py-6 shadow-lg'}w-full transition-all duration-300 text-white py-4 fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-24`}>
      <Link to='/' onClick={()=>{setActive('Home')}}><h1 className="text-3xl font-bold ">Auto<span className='text-green-400'>Sphere</span></h1></Link>
      <div className="hidden sm:flex items-center space-x-20">
        <ul className="flex space-x-6 text-lg">
            {navLinks.map((link)=>{
                return (<li className={`${active  === link.title ? "text-white" : "text-gray-300"} hover:text-white text-[18px]
                    font-medium cursor-pointer`}><Link to={link.link} onClick={()=>setActive(link.title)}>{link.title}</Link></li>)
            })}
        </ul>
        {loggedIn?<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>{setActive('');navigate('/profile')}}>Account</button>:<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>{setActive('');login();}}>Sign In</button>}
      </div>
      <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img src={toggle ? close : menu} alt="menu" className='w-[28px] h-[28px] object-contain cursor-pointer' onClick={()=>setToggle(!toggle)}/>
          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10
          rounded-xl bg-gray-900`}>
              <ul className='list-none flex justify-end items-start flex-col gap-4'>
              {navLinks.map((link)=>(
              <li key={link.id} className={`${active  === link.title ? "text-white" : "text-secondary"} font-poppins 
              font-medium cursor-pointer text-[16px]`} onClick={()=>{setToggle(!toggle);setActive(link.title);}}>
                <Link to={link.link}>{link.title}</Link>
              </li>
              ))}
              </ul>
              {loggedIn?<div className='cursor-pointer' onClick={()=>{navigate('/profile');setActive('')}}>Account</div>:<div className='cursor-pointer' onClick={login}>Sign In</div>}
          </div>
        </div>
    </nav>)}
    {name==='Mechanic' && (<nav className='bg-black shadow-lg w-full transition-all duration-300 text-white py-6 fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-24'>
      <Link to='/' onClick={()=>{setActive('Home')}}><h1 className="text-3xl font-bold ">Auto<span className='text-green-400'>Sphere</span></h1></Link>
      <div className="hidden sm:flex items-center space-x-20">
        <ul className="flex space-x-6 text-lg">
            {mechLinks.map((link)=>{
                return (<li className={`${active  === link.title ? "text-white" : "text-gray-300"} hover:text-white text-[18px]
                    font-medium cursor-pointer`}><Link to={link.link} onClick={()=>setActive(link.title)}>{link.title}</Link></li>)
            })}
        </ul>
        {loggedIn?<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>logout()}>Sign Out</button>:<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>{setActive('');login();}}>Sign In</button>}
      </div>
      <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img src={toggle ? close : menu} alt="menu" className='w-[28px] h-[28px] object-contain cursor-pointer' onClick={()=>setToggle(!toggle)}/>
          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10
          rounded-xl bg-gray-900`}>
              <ul className='list-none flex justify-end items-start flex-col gap-4'>
              {mechLinks.map((link)=>(
              <li key={link.id} className={`${active  === link.title ? "text-white" : "text-secondary"} font-poppins 
              font-medium cursor-pointer text-[16px]`} onClick={()=>{setToggle(!toggle);setActive(link.title);}}>
                <Link to={link.link}>{link.title}</Link>
              </li>
              ))}
              </ul>
              {loggedIn?<div className='cursor-pointer' onClick={()=>logout()}>Sign Out</div>:<div className='cursor-pointer' onClick={login}>Sign In</div>}
          </div>
        </div>
    </nav>)}
    {name==='Car Wash Servicer' && (<nav className='bg-black shadow-lg w-full transition-all duration-300 text-white py-6 fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-24'>
      <Link to='/' onClick={()=>{setActive('Home')}}><h1 className="text-3xl font-bold ">Auto<span className='text-green-400'>Sphere</span></h1></Link>
      <div className="hidden sm:flex items-center space-x-20">
        <ul className="flex space-x-6 text-lg">
            {carWashLinks.map((link)=>{
                return (<li className={`${active  === link.title ? "text-white" : "text-gray-300"} hover:text-white text-[18px]
                    font-medium cursor-pointer`}><Link to={link.link} onClick={()=>setActive(link.title)}>{link.title}</Link></li>)
            })}
        </ul>
        {loggedIn?<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>logout()}>Sign Out</button>:<button className='btn hover:bg-green-600
                 hover:text-white transition-colors duration-300' onClick={()=>{setActive('');login();}}>Sign In</button>}
      </div>
      <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img src={toggle ? close : menu} alt="menu" className='w-[28px] h-[28px] object-contain cursor-pointer' onClick={()=>setToggle(!toggle)}/>
          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10
          rounded-xl bg-gray-900`}>
              <ul className='list-none flex justify-end items-start flex-col gap-4'>
              {carWashLinks.map((link)=>(
              <li key={link.id} className={`${active  === link.title ? "text-white" : "text-secondary"} font-poppins 
              font-medium cursor-pointer text-[16px]`} onClick={()=>{setToggle(!toggle);setActive(link.title);}}>
                <Link to={link.link}>{link.title}</Link>
              </li>
              ))}
              </ul>
              {loggedIn?<div className='cursor-pointer' onClick={()=>logout()}>Sign Out</div>:<div className='cursor-pointer' onClick={login}>Sign In</div>}
          </div>
        </div>
    </nav>)}
    </>
  );
};

export default Navbar;
