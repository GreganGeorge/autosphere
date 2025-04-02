import React from 'react'
import Carousel from './Carousel'
import Information from './Information'
import MechanicHome from './MechanicHome';
import CarWashHome from './CarWashHome';
import DriverHome from './DriverHome';

const Home = ({setActive}) => {
    const name = localStorage.getItem('login');
  return (
    <div>
        {(name==='User' || name===null)&&<Carousel setActive={setActive}/>}
        {(name==='User' || name===null)&&<Information setActive={setActive}/>}
        {(name==='Mechanic') && <MechanicHome/>}
        {(name==='Car Wash Servicer') && <CarWashHome/>}
        {(name==='Driver') && <DriverHome/>}
    </div>
  )
}

export default Home