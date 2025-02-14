import React, { createContext, useState, useContext } from 'react';
import { useNavigate} from "react-router-dom"
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children ,isAuthenticated}) => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(isAuthenticated);
    const login = () => {
      navigate('/login');
    };
  
    const logout = () => {
      setLoggedIn(false);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('login');
      localStorage.removeItem('login_id');
      navigate('/login');
    };
  
    return (
      <AuthContext.Provider value={{ loggedIn,setLoggedIn,login,logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

export default AuthContext;
