import React from 'react'
import { motion } from 'framer-motion'
const Card = ({name,icon:Icon,value,color}) => {
  return (
    <motion.div className='bg-black overflow-hidden shadow-lg rounded-xl border border-black'
    whileHover={{y:-5,boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)"}}>
        <div className='px-4 py-5 sm:p-6'>
            <span className='flex items-center text-md font-medium text-gray-400'>
                <Icon size={30} className="mr-2" style={{color}}/>
                {name}
            </span>
            <p className='mt-1 text-3xl font-semibold text-white'>{value}</p>
        </div>
    </motion.div>
  )
}

export default Card