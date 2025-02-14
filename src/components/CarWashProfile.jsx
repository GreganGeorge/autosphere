import React, { useState,useEffect } from 'react'
import toast from 'react-hot-toast';
import { IoIosRemoveCircle } from "react-icons/io";
import axios from 'axios';

const CarWashProfile = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude,setLongitude]=useState(null);
    const [placeName, setPlaceName] = useState('');
    const [data,setData]=useState([]);
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [address,setAddress]=useState('');
    const [about,setAbout]=useState('');
    const [services,setServices]=useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [customServices, setCustomServices] = useState([]);
    const [storedServices, setStoredServices] = useState([]);
    const [offDays, setOffDays] = useState([]);
    const [offDates, setOffDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [availableTime,setAvailableTime] = useState([]);
    const [storedOffDates,setStoredOffDates]=useState([]);
    const getTime=()=>{
        const timeList=[];
        for(let i=10;i<=12;i++){
            timeList.push({time:i+':00 AM'})
            timeList.push({time:i+':30 AM'})
        }
        for(let i=1;i<=6;i++){
            timeList.push({time:i+':00 PM'})
            timeList.push({time:i+':30 PM'})
        }
        const time=timeList.map((t)=>t.time)
        setAvailableTime(time);
    }
    const handleAddOffDate = () => {
        if (selectedDate) {
          setOffDates((prev) => [
            ...prev,
            { date: selectedDate, timeSlots: [...timeSlots] },
          ]);
          setSelectedDate("");
          setTimeSlots([]);
        }
      };
    const handleDayToggle = (day) => {
        setOffDays((prev) =>
          prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
      };    
    const addSelectedService = (service) => {
        if (service && !selectedServices.some((item) => item.name === service)) {
          setSelectedServices([...selectedServices, { name: service, fee: "" }]);
        }
      };

      const handleRemoveService = (index) => {
        setSelectedServices((prevServices) =>
          prevServices.filter((_, i) => i !== index)
        );
      };
    
      const handleSelectedService=(id)=>{
        fetch(`http://localhost:5059/api/CarWash/Delete1?id=${id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                selectedService();
            },(error)=>{
            })
      }
      
      const addCustomService = () => {
        setCustomServices([...customServices,{ name: "", fee: "", type: "" },
        ]);
      };
    
      const updateCustomService = (index, field, value) => {
        const updatedCustomServices = [...customServices];
        updatedCustomServices[index][field] = value;
        setCustomServices(updatedCustomServices);
      };
      const handleFeeChange = (index, newFee) => {
        setStoredServices((prev) =>
          prev.map((service, i) =>
            service.service_id === index ? { ...service, fee: newFee } : service
          )
        );
      };
    const getLocation = () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lon);
            getPlaceName(lat, lon);
            },
            (error) => {
                toast.error('Unable to retrieve location. Please ensure location services are enabled.');
            }
        );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    const getPlaceName = async (lat, lon) => {
        const apiKey = '94a2fdd2253d47919cc4f9cc27a10036';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                setPlaceName(data.results[0].formatted);
            } else {
                setPlaceName('Unknown location');
            }
        } catch (error) {
            toast.error('Error fetching place name:', error);
        }
    };
    const getData=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/CarWash/Get1?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          setEmail(data[0]?.email);
          setName(data[0]?.username);
          setNumber(data[0]?.phone_number);
          setLatitude(data[0]?.latitude);
          setLongitude(data[0]?.longitude);
          setPlaceName(data[0]?.location);
          setAddress(data[0]?.addr);
          setAbout(data[0]?.about);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getServices=async()=>{
        const url = `http://localhost:5059/api/CarWash/Get2`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const handleRemoveOffDate=(date)=>{
        fetch(`http://localhost:5059/api/CarWash/Delete2?date=${date}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log(result);
                getOffDates();
            },(error)=>{
                console.log('Failed');
            })
    }
    const getOffDays=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/CarWash/Get8?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          const days = data.map(item => item.day);
          setOffDays(days);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const selectedService=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/CarWash/Get3?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setStoredServices(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const getOffDates=async()=>{
        const id = localStorage.getItem('login_id');
        const url = `http://localhost:5059/api/CarWash/Get9?id=${id}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          const result=groupByDate(data);
          setStoredOffDates(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const groupByDate = (data) => {
        return data.reduce((result, item) => {
          const date = item.off_date.split("T")[0];
          if (!result[date]) {
            result[date] = [];
          }
          result[date].push(item.time);
          return result;
        }, {});
      };
    const update=async()=>{
        const id = localStorage.getItem('login_id');
        fetch(`http://localhost:5059/api/CarWash/Put1?id=${id}&username=${name}&phone_number=${number}&latitude=${latitude}&longitude=${longitude}&place=${placeName}&addr=${address}&about=${about}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:id,
                username:name,
                phone_number:number,
                latitude:latitude,
                longitude:longitude,
                place:placeName,
                addr:address,
                about:about,
            })
            })
            .then(res=>res.json())
            .then((result)=>{
                toast.success(result);
                getData();
            },(error)=>{
                toast.error('Failed');
            })
            let updatedServices = [...selectedServices];

            try {
                const validCustomServices = customServices.filter(service => 
                    service.name && service.fee && service.type &&
                    !services.some(fetchedService => fetchedService.services === service.name)
                );

                if (validCustomServices.length > 0) {
                    await axios.post('http://localhost:5059/api/CarWash/Post1', 
                        validCustomServices.map(service => ({
                            service: service.name,
                            type: service.type
                        }))
                    );
                    console.log("Custom Services inserted.");
                    updatedServices = [
                        ...updatedServices, 
                        ...validCustomServices.map(service => ({
                            name: service.name,
                            fee: service.fee,
                        }))
                    ];
                }
                if (updatedServices.length > 0) {
                    const newServices = updatedServices.filter(service => service.name && service.fee);
                    
                    if (newServices.length > 0) {
                        const payload = {
                            id,
                            selectedServices: newServices.map(service => ({
                                service: service.name,
                                fee: parseInt(service.fee, 10),
                            }))
                        };
                        
                        const response = await axios.post('http://localhost:5059/api/CarWash/Post2', payload);
                        console.log("Selected services inserted:", response.data);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
            
        try{
            const payload = storedServices.map(service => ({
                service_id: service.service_id,
                fee: service.fee,
            }));
            const response = await axios.put(
                "http://localhost:5059/api/CarWash/Put2",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Fee updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating fee:", error);
        }
        try{
            const response = await axios.post(
                `http://localhost:5059/api/CarWash/UpdateOffDays?id=${id}`,
                offDays,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Off days updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating Off days:", error);
        }
        if(offDates.length>0){
            axios.post(`http://localhost:5059/api/CarWash/AddOffDates?id=${id}`, offDates)
            .then(response => {
                getOffDates();
                console.log(response.data);
                setOffDates([]);
            })
            .catch(error => {
                console.error("Error inserting dates:", error);
            });
        }
    }
    useEffect(()=>{
        getData();
        getServices();
        selectedService();
        getOffDays();
        getTime();
        getOffDates();
    },[])
  return (
    <div className='flex justify-center items-center mt-40 mb-60'>
        <div className='w-full max-w-lg'>
            <h2 className="text-3xl font-semibold mb-6 text-center">Car Wash Servicer Profile</h2>
            <button onClick={getLocation} className="mb-6 w-full px-4 py-2 text-base font-medium text-white 
            bg-green-600 rounded-md shadow-sm hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Capture Current Location</button>
            {(latitude && longitude) && (<div className="mb-4 text-center">
                {placeName && <p className="font-semibold text-gray-700"><span className='font-bold text-[17px]'>Current Location:</span> {placeName}</p>}
            </div>)}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{email}</p>
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    id="username"
                    type="text"
                    value={name}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="text"
                    value={number}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setNumber(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    value={address}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">About Me</label>
                <textarea rows={6}
                    type="text"
                    value={about}
                    className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e)=>setAbout(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                <h3 className="text-xl font-semibold mb-2 text-green-600">Interior</h3>
                {storedServices.filter((interiorServices) =>interiorServices.type==='Interior').length>0 ? (
                <div className="space-y-4">
                    {storedServices.filter((service) =>service.type==='Interior').map((service, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-gray-100"
                    >
                        <span className="text-gray-700">{service.services}</span>
                        <input
                        type="number"
                        placeholder="Fee"
                        value={service.fee || ""}
                        onChange={(e) => handleFeeChange(service.service_id, e.target.value)}
                        className="border rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <IoIosRemoveCircle
                        className="text-red-600 text-2xl cursor-pointer"
                        onClick={() => handleSelectedService(service.service_id)}
                        />
                    </div>
                    ))}
                </div>
                ): (
                    <p className="text-gray-500">No Interior services available.</p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">Exterior</h3>
                {storedServices.filter((exteriorServices) => exteriorServices.type==='Exterior').length>0? (
                <div className="space-y-4">
                    {storedServices.filter((exteriorServices) => exteriorServices.type==='Exterior').map((service, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-gray-100"
                    >
                        <span className="text-gray-700">{service.services}</span>
                        <input
                        type="number"
                        placeholder="Fee"
                        value={service.fee || ""}
                        onChange={(e) => handleFeeChange(service.service_id, e.target.value)}
                        className="border rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <IoIosRemoveCircle
                        className="text-red-600 text-2xl cursor-pointer"
                        onClick={() => handleSelectedService(service.service_id)}
                        />
                    </div>
                    ))}
                </div>
                ): (
                    <p className="text-gray-500">No Exterior services available.</p>
                )}
            </div>
            <div className="mb-6 mt-6">
                <label className="block text-sm font-medium text-gray-700">
                Select Services
                </label>
                <div className="flex gap-4 mb-4">
                    <select
                        onChange={(e) => addSelectedService(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select a Service</option>
                        {services.map((service, index) => (
                        <option key={index} value={service.services}>
                            {service.services}
                        </option>
                        ))}
                    </select>
            </div>

            {selectedServices.map((service, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
                <span className="flex-1">{service.name}</span>
                <input
                type="number"
                placeholder="Fee"
                value={service.fee}
                onChange={(e) =>
                    setSelectedServices((prev) =>
                    prev.map((s, i) =>
                        i === index ? { ...s, fee: e.target.value } : s
                    )
                    )
                }
                className="border rounded-lg p-2 w-28"
                />
                <IoIosRemoveCircle
                className="text-red-600 text-2xl cursor-pointer"
                onClick={() => handleRemoveService(index)}
                />
            </div>
            ))}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Add Custom Services</label>
            {customServices.map((service, index) => (
            <div key={index} className="flex gap-4 mb-2">
                <input
                type="text"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => updateCustomService(index, 'name', e.target.value)}
                className="border rounded-lg p-2 flex-1"
                />
                <input
                type="number"
                placeholder="Fee"
                value={service.fee}
                onChange={(e) => updateCustomService(index, 'fee', e.target.value)}
                className="border rounded-lg p-2 w-28"
                />
                <select
                value={service.type}
                onChange={(e) => updateCustomService(index, 'type', e.target.value)}
                className="border rounded-lg p-2 w-32"
                >
                <option value="" disabled>
                    Select Type
                </option>
                <option value="Exterior">Exterior</option>
                <option value="Interior">Interior</option>
                </select>
            </div>
            ))}
            <button
            onClick={addCustomService}
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 mb-4"
            >
            Add Another Service
            </button>
        </div>
        <div className="mb-6">
            <h3 className="block text-sm font-medium text-gray-700 mb-1">Off Days</h3>
                <div className="grid grid-cols-3 gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label
                    key={day}
                    className={`cursor-pointer px-3 py-2 border rounded-lg ${
                        offDays.includes(day) ? "bg-green-500 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => handleDayToggle(day)}
                    >
                    {day}
                    </label>
                ))}
                </div>
            </div>
            <div className="mb-6">
                <h3 className="block text-sm font-medium text-gray-700">Add Specific Off Dates</h3>
                <div className="flex items-center gap-4 mb-4">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                />
                <button
                    onClick={handleAddOffDate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Add Date
                </button>
                </div>

                {offDates.map((offDate, index) => (
                <div key={index} className="mb-4">
                    <h4 className="font-medium mb-2">
                    Date: {new Date(offDate.date).toLocaleDateString("en-GB")}
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                    {availableTime.map((slot) => (
                        <label
                        key={slot}
                        className={`cursor-pointer px-3 py-2 border rounded-lg ${
                            offDate.timeSlots.includes(slot)
                            ? "bg-green-500 text-white"
                            : "bg-gray-100"
                        }`}
                        onClick={() => {
                            setOffDates((prev) =>
                            prev.map((d, i) =>
                                i === index
                                ? {
                                    ...d,
                                    timeSlots: d.timeSlots.includes(slot)
                                        ? d.timeSlots.filter((t) => t !== slot)
                                        : [...d.timeSlots, slot],
                                    }
                                : d
                            )
                            );
                        }}
                        >
                        {slot} 
                        </label>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            <h2 className="block text-sm font-medium text-gray-700 mb-2">Off Dates & Time Slots</h2>
            {Object.keys(storedOffDates).length === 0 ? (
                <p className="text-gray-600">No off dates added yet.</p>
            ) : (
                <div className="space-y-4">
                {Object.entries(storedOffDates).map(([date, timeSlots], index) => (
                    <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                    >
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-medium">
                        {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        </span>
                        <IoIosRemoveCircle
                        className="text-red-600 text-2xl cursor-pointer"
                        onClick={() => handleRemoveOffDate(date)}
                        />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                    {timeSlots && timeSlots.filter((slot) => slot).length > 0 ? (timeSlots.filter((slot) => slot).map((time, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-300"
                        >
                            {time}
                        </span>
                        ))):<span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-300">Full Day</span>}
                    </div>
                    </div>
                ))}
            </div>
            )}
            <button
                className="w-full mt-6 px-4 py-2 text-base font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={update}
            >
                Save Changes
            </button>
        
        </div>
    </div>
  )
}

export default CarWashProfile