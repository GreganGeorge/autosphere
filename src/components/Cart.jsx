import React, { useEffect,useState } from 'react'
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const login_id=localStorage.getItem('login_id');
    const {getCount}=useCart();
    const [cart,setCart]=useState([]);
    const [total,setTotal]=useState();
    const getCart=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get4?id=${login_id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCart(data);
            const totalPrice = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotal(totalPrice);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleQuantity=(val,id)=>{
        if(val>=1){
            fetch(`http://localhost:5059/api/SpareParts/Put2?id=${id}&quantity=${val}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log("Updated!");
                getCart();
            },(error)=>{
                toast.error('Failed');
            })
        }
    }
    const handleDelete=(id)=>{
        fetch(`http://localhost:5059/api/SpareParts?id=${id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log(result);
                getCart();
                getCount();
            },(error)=>{
                toast.error('Failed');
            })
    }
    useEffect(()=>{
        getCart();
    },[])
  return (
    <div className='mt-36 mx-20 mb-40'>
        <div className='text-2xl mb-3'>
        <div className='inline-flex gap-2 items-center mb-6'>
            <p className='text-gray-700 text-3xl'>YOUR<span className='text-gray-700 font-medium'> CART</span></p>
            <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
        </div>
        </div>
            {cart.length>0?<>{cart.map((item)=>(
                <div className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr_0.5fr] sm:grid-cols-[4fr_5fr_3fr_1fr] items-center gap-4'>
                    <div className='flex items-start gap-6'>
                        <img className='w-16 sm:w-20' src={item.image_url}/>
                        <div>
                            <p className='text-sm sm:text-[16px] font-medium'>{item.brand}</p>
                            <p className='text-sm sm:text-[18px] font-medium'>{item.title}</p>
                            <div className='flex items-center gap-5 mt-2'>
                                <p>₹{item.price}</p>
                            </div>
                        </div>                        
                    </div>
                    <span className='text-[20px]'>Quantity: <input className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1" onChange={(e)=>handleQuantity(e.target.value,item.cart_id)} type='number' min={1} defaultValue={item.quantity}/></span>
                    <span className='text-[23px]'>Subtotal: <span>₹{item.price*item.quantity}</span></span>
                    <MdDelete onClick={()=>handleDelete(item.cart_id)} className='w-6 h-6 mr-4 cursor-pointer'/>
                </div>
            ))}
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
                    <Link to={'/delivery'} state={{value:total}} className="text-white mt-3 bg-green-600 hover:bg-green-700 duration-100 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-md text-md px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">PROCEED TO CHECKOUT</Link>
                </div>
            </div>
        </div></>:<p className='text-gray-700 font-medium text-3xl mt-20'>Cart is empty</p>}
    </div>
  )
}

export default Cart