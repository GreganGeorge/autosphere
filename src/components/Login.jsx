import React, { useState } from 'react'
import img1 from '../assets/sports-car-futuristic-mountain-sunset-scenery-digital-art-4k-wallpaper-uhdpaper.com-537@0@i.jpg'
import img2 from '../assets/auto-mechanic-using-diagnostic-tool-while-checking-car-battery-voltage-workshop_637285-4267.jpg'
import img3 from '../assets/professional-washer-blue-uniform-washing-luxury-car-with-water-gun-open-air-car-wash_496169-333.avif'
import img4 from '../assets/Lovepik_com-361465043-immerse-in-a-3d-rendered-backdrop-of-dark-spacious-hall-with-mesmerizing-blue-lighting-for-vehicle-background.jpg'
import img5 from '../assets/why-kei-8e2gal_GIE8-unsplash.jpg';
import toast from 'react-hot-toast';
import {useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
const data=[
    {
        title:'User'
    },
    {
        title:'Mechanic'
    },
    {
        title:'Car Wash Servicer'
    },
    {
        title:'Driver'
    },
]

const Login = () => {
    const [form,setForm]=useState(null);
    const {getCount}=useCart();
    const [sign,setSign]=useState('login');
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [number,setNumber]=useState();
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [govIdProof,setGovIdProof]=useState(null);
    const [mechanicCertificate,setMechanicCertificate]=useState(null);
    const [carWashVideo,setCarWashVideo]=useState(null);
    const [licenseProof,setLicenseProof]=useState(null);
    const { setLoggedIn } = useAuth(); 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate=useNavigate();
    const handleSignUp=(e)=>{
        e.preventDefault();
        if(form==='User'){
            if(password!==confirmPassword){
                toast.error("Password is not same. Please try again!")
            }
            else if(email===''||name===''||number===''||password===''||confirmPassword===''){
                toast.error("Please fill all fields!")
            }
            else if (!emailRegex.test(email)) {
                toast.error("Invalid email format!");
            }
            else{
                fetch(`http://localhost:5059/api/User?email=${email}&name=${name}&number=${number}&password=${password}`,{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        email:email,
                        name:name,
                        number:number,
                        password:password
                    })
                })
                .then(res=>res.json())
                .then((result)=>{
                    toast.success("Account Created.Please Login.");
                    setEmail('');
                    setName('');
                    setPassword('')
                    setConfirmPassword('')
                    setNumber('');
                },(error)=>{
                    toast.error("Error");
                })
            }
        }
        else if(form==='Mechanic'){
            if(password!==confirmPassword){
                toast.error("Password is not same. Please try again!")
            }
            else if(email===''||name===''||number===''||password===''||confirmPassword===''||govIdProof===null||mechanicCertificate===null){
                toast.error("Please fill all fields!")
            }
            else if (!emailRegex.test(email)) {
                toast.error("Invalid email format!");
            }
            else{
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
                formData.append('number', number);
                formData.append('password', password);
                const uploadFilesToFirebase = async () => {
                    try {
                        const uniqueGovIdProofName = `${uuidv4()}_${govIdProof.name}`;
                        const uniqueMechanicCertName = `${uuidv4()}_${mechanicCertificate.name}`;

                        const govIdProofRef = ref(storage, `govIdProofs/${uniqueGovIdProofName}`);
                        const govIdProofSnapshot = await uploadBytesResumable(govIdProofRef, govIdProof);
                        const govIdProofURL = await getDownloadURL(govIdProofSnapshot.ref);
                        
                        const mechanicCertRef = ref(storage, `mechanicCerts/${uniqueMechanicCertName}`);
                        const mechanicCertSnapshot = await uploadBytesResumable(mechanicCertRef, mechanicCertificate);
                        const mechanicCertURL = await getDownloadURL(mechanicCertSnapshot.ref);
        
                        formData.append('govIdProofURL', govIdProofURL);
                        formData.append('mechanicCertURL', mechanicCertURL);

                        const response = await fetch('http://localhost:5059/api/User/Post2', {
                            method: 'POST',
                            body: formData,
                        });
        
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
        
                        const result = await response.json();
                        toast.success("You will receive mail after checking.Thank You!");
                        setEmail('');
                        setName('');
                        setPassword('')
                        setConfirmPassword('')
                        setNumber('');
                        setGovIdProof(null);
                        setMechanicCertificate(null);
                    } catch (error) {
                        console.error('Error uploading files:', error);
                        toast.error("Error occurred while creating account.");
                    }
                };
        
                uploadFilesToFirebase();
            }
        //     else {
        //         const readerGovIdProof = new FileReader();
        //         const readerMechanicCert = new FileReader();
        //         const formData = new FormData();
        //         formData.append('email', email);
        //         formData.append('name', name);
        //         formData.append('number', number);
        //         formData.append('password', password);
        //         readerGovIdProof.onload = async (event) => {
        //         const govIdByteArray = new Uint8Array(event.target.result);
        //         formData.append('govIdProof', new Blob([govIdByteArray]), govIdProof.name);

        //         if (mechanicCertificate) {
        //             readerMechanicCert.onload = async (event) => {
        //                 const mechanicCertByteArray = new Uint8Array(event.target.result);
        //                 formData.append('mechanicCertification', new Blob([mechanicCertByteArray]), mechanicCertificate.name); 
        //                 try {
        //                     const response = await fetch('http://localhost:5059/api/User/Post2', {
        //                         method: 'POST',
        //                         body: formData,
        //                     });
        
        //                     if (!response.ok) {
        //                         throw new Error('Network response was not ok');
        //                     }
        
        //                     const result = await response.json();
        //                     toast.success("Account Created. Please Login.");
        //                     console.log(result);
        //                 } catch (error) {
        //                     console.error('Error:', error);
        //                     toast.error("Error occurred while creating account.");
        //                 }
        //             };
        
        //             readerMechanicCert.readAsArrayBuffer(mechanicCertificate); 
        //         } else {
            
        //             try {
        //                 const response = await fetch('http://localhost:5059/api/User/Post2', {
        //                     method: 'POST',
        //                     body: formData,
        //                 });
        
        //                 if (!response.ok) {
        //                     throw new Error('Network response was not ok');
        //                 }
        
        //                 const result = await response.json();
        //                 toast.success("Account Created. Please Login.");
        //                 console.log(result);
        //             } catch (error) {
        //                 console.error('Error:', error);
        //                 toast.error("Error occurred while creating account.");
        //             }
        //         }
        //     };
        
        //     if (govIdProof) {
        //         readerGovIdProof.readAsArrayBuffer(govIdProof);
        //     }
        // }
        }
        else if(form==='Car Wash Servicer')
        {
            if(password!==confirmPassword){
                toast.error("Password is not same. Please try again!")
            }
            else if(email===''||name===''||number===''||password===''||confirmPassword===''||govIdProof===null||carWashVideo===null){
                toast.error("Please fill all fields!")
            }
            else if (!emailRegex.test(email)) {
                toast.error("Invalid email format!");
            }
            else{
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
                formData.append('number', number);
                formData.append('password', password);
                const uploadFilesToFirebase = async () => {
                    try {
                        const uniqueGovIdProofName = `${uuidv4()}_${govIdProof.name}`;
                        const uniquecarWashVideoName = `${uuidv4()}_${carWashVideo.name}`;
                        const govIdProofRef = ref(storage, `govIdProofs/${uniqueGovIdProofName}`);
                        const govIdProofSnapshot = await uploadBytesResumable(govIdProofRef, govIdProof);
                        const govIdProofURL = await getDownloadURL(govIdProofSnapshot.ref);
                        
                        const carWashVideoRef = ref(storage, `carWashVideo/${uniquecarWashVideoName}`);
                        const carWashVideoSnapshot = await uploadBytesResumable(carWashVideoRef, carWashVideo);
                        const carWashVideoURL = await getDownloadURL(carWashVideoSnapshot.ref);
        
                        formData.append('govIdProofURL', govIdProofURL);
                        formData.append('carWashVideoURL', carWashVideoURL);

                        const response = await fetch('http://localhost:5059/api/User/Post3', {
                            method: 'POST',
                            body: formData,
                        });
        
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
        
                        const result = await response.json();
                        toast.success("You will receive mail after checking.Thank You!");
                        console.log(result); 
                        setEmail('');
                        setName('');
                        setPassword('')
                        setConfirmPassword('')
                        setNumber('');
                        setGovIdProof(null);
                        setCarWashVideo(null);
                    } catch (error) {
                        console.error('Error uploading files:', error);
                        toast.error("Error occurred while creating account.");
                    }
                };
        
                uploadFilesToFirebase();
            }
        }
        else if(form==='Driver'){
            if(password!==confirmPassword){
                toast.error("Password is not same. Please try again!")
            }
            else if(email===''||name===''||number===''||password===''||confirmPassword===''||govIdProof===null||licenseProof===null){
                toast.error("Please fill all fields!")
            }
            else if (!emailRegex.test(email)) {
                toast.error("Invalid email format!");
            }
            else{
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
                formData.append('number', number);
                formData.append('password', password);
                const uploadFilesToFirebase = async () => {
                    try {
                        const uniqueGovIdProofName = `${uuidv4()}_${govIdProof.name}`;
                        const uniqueLicenseProofName = `${uuidv4()}_${licenseProof.name}`;

                        const govIdProofRef = ref(storage, `govIdProofs/${uniqueGovIdProofName}`);
                        const govIdProofSnapshot = await uploadBytesResumable(govIdProofRef, govIdProof);
                        const govIdProofURL = await getDownloadURL(govIdProofSnapshot.ref);
                        
                        const licenseProofRef = ref(storage, `licenseProof/${uniqueLicenseProofName}`);
                        const licenseProofSnapshot = await uploadBytesResumable(licenseProofRef, licenseProof);
                        const licenseProofURL = await getDownloadURL(licenseProofSnapshot.ref);
        
                        formData.append('govIdProofURL', govIdProofURL);
                        formData.append('licenseProofURL', licenseProofURL);

                        const response = await fetch('http://localhost:5059/api/User/Post4', {
                            method: 'POST',
                            body: formData,
                        });
        
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
        
                        const result = await response.json();
                        toast.success("You will receive mail after checking.Thank You!");
                        setEmail('');
                        setName('');
                        setPassword('')
                        setConfirmPassword('')
                        setNumber('');
                        setGovIdProof(null);
                        setLicenseProof(null);
                    } catch (error) {
                        console.error('Error uploading files:', error);
                        toast.error("Error occurred while creating account.");
                    }
                };
        
                uploadFilesToFirebase();
            }
        }
    }
    const handleSignIn=(e)=>{
        e.preventDefault();
        if(form==='User'){
            if(email===''||password===''){
                toast.error("Please fill all fields!")
            }
            else{
                fetch(`http://localhost:5059/api/user?pass=${password}&email=${email}&form=${form}`)
                .then((response) => response.json())
                .then((json) => {
                if(json.length>0){
                    toast.success("Logged in");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('login','User');
                    localStorage.setItem('login_id', json[0].id);
                    setLoggedIn(true);
                    navigate(`/`); 
                    getCount();
                }
                else{
                    toast.error("Incorrect credentials");
                }
                });
            }
        }
        else if(form==='Mechanic'){
            if(email===''||password===''){
                toast.error("Please fill all fields!")
            }
            else{
                fetch(`http://localhost:5059/api/user?pass=${password}&email=${email}&form=${form}`)
                .then((response) => response.json())
                .then((json) => {
                if(json.length>0){
                    toast.success("Logged in");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('login','Mechanic');
                    localStorage.setItem('login_id', json[0].id);
                    setLoggedIn(true);
                    navigate(`/`); 
                }
                else{
                    toast.error("Incorrect credentials");
                }
                });
            }
        }
        else if(form==='Car Wash Servicer'){
            if(email===''||password===''){
                toast.error("Please fill all fields!")
            }
            else{
                fetch(`http://localhost:5059/api/user?pass=${password}&email=${email}&form=${form}`)
                .then((response) => response.json())
                .then((json) => {
                if(json.length>0){
                    toast.success("Logged in");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('login','Car Wash Servicer');
                    localStorage.setItem('login_id', json[0].id);
                    setLoggedIn(true);
                    navigate(`/`); 
                }
                else{
                    toast.error("Incorrect credentials");
                }
                });
            }
        }
        else if(form==='Driver'){
            if(email===''||password===''){
                toast.error("Please fill all fields!")
            }
            else{
                fetch(`http://localhost:5059/api/user?pass=${password}&email=${email}&form=${form}`)
                .then((response) => response.json())
                .then((json) => {
                if(json.length>0){
                    toast.success("Logged in");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('login','Driver');
                    localStorage.setItem('login_id', json[0].id);
                    setLoggedIn(true);
                    navigate(`/`); 
                }
                else{
                    toast.error("Incorrect credentials");
                }
                });
            }
        }
    }
    const handleFileChange=(event,setFile)=>{
        setFile(event.target.files[0])
    }
  return (
    <div>
        {form && sign==='login' && <div className='text-white h-[100vh] flex justify-center items-center bg-cover mt-20'
            style={{ backgroundImage: `url(${form==='User'?img1:form==='Mechanic'?img2:form==='Car Wash Servicer'?img3:form==='Driver'?img5:''})`, backgroundPosition: 'center' }}>
                <button className='absolute top-0 mt-40 left-0 ml-20 mb-4 text-[20px] rounded-full bg-white text-purple-800 hover:bg-purple-600
                 hover:text-white py-2 px-10 transition-colors duration-300' onClick={()=>{setForm(null);setSign('login')}}>Back</button>
                <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter
                backdrop-blur-sm bg-opacity-30 relative'>
                    <h1 className='text-4xl text-white font-bold text-center mb-6'>Sign In</h1>
                    <form>
                        <div className='relative my-8'>
                            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Email</label>
                        </div>
                        <div className='relative my-8'>
                            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Password</label>
                        </div>
                        <button type="submit" onClick={handleSignIn} className='w-full mb-4 text-[20px] mt-6 rounded-full bg-white text-purple-800 hover:bg-purple-600 hover:text-white py-2 transition-colors duration-300'>Sign In</button>
                        <div>
                            <span className='m-4'>New Here? <span onClick={()=>setSign('signup')} className='text-purple-500 cursor-pointer'> Create an Account</span></span>
                        </div>
                    </form>
                </div>
            </div>}
        {form && sign==='signup' && <div className='text-white h-[100vh] flex justify-center items-center bg-cover mt-20'
            style={{ backgroundImage: `url(${form==='User'?img1:form==='Mechanic'?img2:form==='Car Wash Servicer'?img3:form==='Driver'?img5:''})`, backgroundPosition: 'center' }}>
                <button className='absolute top-0 mt-40 left-0 ml-20 mb-4 text-[20px] rounded-full bg-white text-purple-800 hover:bg-purple-600
                 hover:text-white py-2 px-10 transition-colors duration-300' onClick={()=>{setForm(null);setSign('login')}}>Back</button>
                <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter
                backdrop-blur-sm bg-opacity-30 relative'>
                    <h1 className='text-4xl text-white font-bold text-center mb-6'>Sign Up</h1>
                    <form>
                        <div className='relative my-8'>
                            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Email</label>
                        </div>
                        <div className='relative my-8'>
                            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Username</label>
                        </div>
                        <div className='relative my-8'>
                            <input value={number} onChange={(e)=>setNumber(e.target.value)} type="number" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Phone Number</label>
                        </div>
                        <div className='relative my-8'>
                            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Password</label>
                        </div>
                        <div className='relative my-8'>
                            <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Confirm Password</label>
                        </div>
                        {form!=='User' && <div className='relative my-8'>
                            <input type="file" onChange={(e)=>handleFileChange(e,setGovIdProof)} accept="application/pdf" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute mb-5 text-lg text-white duration-300 transform -translate-y-6 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Government Id Proof</label>
                        </div>}
                        {form==='Mechanic' && <div className='relative my-8'>
                            <input type="file" onChange={(e)=>handleFileChange(e,setMechanicCertificate)} accept="application/pdf" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute mb-5 text-lg text-white duration-300 transform -translate-y-6 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Mechanic Certification/Qualifications</label>
                        </div>} 
                        {form==='Car Wash Servicer' && <div className='relative my-8'>
                            <input type="file" onChange={(e)=>handleFileChange(e,setCarWashVideo)} accept="video/*" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute mb-5 text-lg text-white duration-300 transform -translate-y-6 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Car Wash Servicing Video</label>
                        </div>}
                        {form!=='User' && <div className='relative my-8'>
                            <input type="file" onChange={(e)=>handleFileChange(e,setLicenseProof)} accept="application/pdf" className='block w-80 py-3 px-0 text-lg text-white bg-transparent border-0 border-gray-300 appearance-none dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:text-white focus:border-purple-600 peer' placeholder=''/>
                            <label className='absolute mb-5 text-lg text-white duration-300 transform -translate-y-6 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 '>Driving License</label>
                        </div>}
                        <button type="submit" onClick={handleSignUp} className='w-full mb-4 text-[20px] mt-6 rounded-full bg-white text-purple-800 hover:bg-purple-600 hover:text-white py-2 transition-colors duration-300'>Sign Up</button>
                        <div>
                            <span className='m-4'>Already Created Account?<span onClick={()=>setSign('login')} className='text-purple-300 cursor-pointer'> Sign In</span></span>
                        </div>
                    </form>
                </div>
            </div>}
        {!form &&
        <div className='relative bg-cover bg-center' style={{ backgroundImage: `url(${img4})`, backgroundPosition: 'center'}}>
        <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 mx-60 pb-80 pt-80 gap-2'>
            {data.map((item)=>(
                <button className='bg-blue-600 text-white rounded-2xl font-bold text-[24px] flex flex-col gap-4 items-center justify-center
                p-4 py-28 hover:bg-blue-700 hover:scale-100 duration-300 hover:shadow-2xl' onClick={()=>setForm(item.title)}>{item.title}</button>
            ))}
        </div>
        </div>}
    </div>
  )
}

export default Login