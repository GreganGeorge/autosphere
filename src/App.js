import Home from "./components/Home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthContext";
import UserProfile from "./components/UserProfile";
import MechanicProfile from "./components/MechanicProfile";
import PricePrediction from "./components/PricePrediction";
import MechanicDetails from "./components/MechanicDetails";
import Success from "./components/Success";
import CarWashSearch from "./components/CarWashSearch";
import CarWashProfile from "./components/CarWashProfile";
import CarWashDetails from "./components/CarWashDetails";
import QAndA from "./components/QAndA";
function App() {
  const [active,setActive]=useState('Home');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return (
    <BrowserRouter>
    <AuthProvider isAuthenticated={isAuthenticated}>
    <Toaster/>
    <Navbar active={active} setActive={setActive}/>
    <Routes>
        <Route exact path="/" element={<Home setActive={setActive}/>}/>
        <Route exact path="/alert" element={<Alert/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/profile" element={<UserProfile/>}/>
        <Route exact path="/mechprofile" element={<MechanicProfile/>}/>
        <Route exact path="/price" element={<PricePrediction/>}/>
        <Route exact path="/mechanic/:id" element={<MechanicDetails/>}/>
        <Route exact path="/success" element={<Success/>}/>
        <Route exact path="/carwash" element={<CarWashSearch/>}/>
        <Route exact path="/carwashprofile" element={<CarWashProfile/>}/>
        <Route exact path="/carwash/:id" element={<CarWashDetails/>}/>
        <Route exact path="/q&a" element={<QAndA/>}/>
    </Routes>
    <Footer/>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
