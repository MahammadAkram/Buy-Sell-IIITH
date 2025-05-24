import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/items.module.css"
import { useNavigate } from "react-router-dom";

export default function MyCart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                console.log(user);
                if (!user) return;
                console.log(user.Email)
                const response = await axios.get(`http://localhost:3001/api/cart/${user.Email}`);
                const cartData = response.data || [];  
                setCartItems(cartData);
                
                const total = cartData.reduce((sum, item) => sum + (Number(item.Price) || 0), 0);
                setTotalPrice(total);
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };

        fetchCart();
    }, []);


    const handlePlace= async ()=>{
        const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user not authenticated.");
                return;
            }
        // console.log(cartItems,"hhhhhh");
        const response = await axios.post(`http://localhost:3001/api/otp`, { cartItems }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const otp = response.data.otp;
        // console.log(response.data.otp,"awdow");
        alert(`Otp is ${otp}`);
        navigate('/OrdersHistory')
    }

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user not authenticated.");
                return;
            }
    
            console.log("Attempting to remove item:", itemId); 
    
            await axios.post(`http://localhost:3001/api/cart/remove`,{itemId}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
           
            setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
            setTotalPrice(prevTotal => prevTotal - cartItems.find(item => item._id === itemId)?.Price || 0);
        } catch (err) {
            console.error("Error removing item from cart:", err);
        }
    };
    

    return (
        <>
            <Navbar />
            <div style={{ textAlign: "center" }}>
                {/* <h1>My Cart</h1> */}
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        <ul style={{ listStyle: "none", padding: 0, marginTop:'50px'}} className={styles.first}>
                            {cartItems.map((item, index) => (
                                <li key={index}  className={styles.second}>
                                    <h2>{item.Name}</h2>
                                    <p><strong>Price:</strong> ${ (Number(item.Price) || 0).toFixed(2) }</p>
                                    <p><strong>Description:</strong> {item.Description}</p>
                                    <p><strong>Category:</strong>{item.Category}</p>
                                    <p><strong>SellerID:</strong>{item.SellerID}</p>
                                    <button className="btn btn-danger" style={{marginTop:'10px'}} onClick={() => {handleRemoveItem(item._id)}}>Remove Item</button>

                                    
                                </li>
                            ))}
                        </ul>
                        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
                            <button className="btn btn-success" onClick={handlePlace}>Place Order</button>
                    </>
                )}
            </div>
        </>
    );
}
