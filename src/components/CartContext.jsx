import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const getCount=async()=>{
          const id=localStorage.getItem('login_id');
          const url = `http://localhost:5059/api/SpareParts/Get5?id=${id}`;
            try {
              const response = await fetch(url);
              const data = await response.json();
              setCartCount(data[0].cart_count);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
        }
    useEffect(() => {
        getCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, getCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
