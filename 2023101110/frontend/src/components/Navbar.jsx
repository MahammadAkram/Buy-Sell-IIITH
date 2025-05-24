import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/navbar.module.css'
import { useNavigate } from 'react-router-dom'


export default function Navbar(){
    const navigate= useNavigate();

    const handleDashboard=()=>{
        console.log("Home Dashboard")
        navigate("/Dashboard");
    }
    const handleItems=()=>{
        console.log("Items Page")
        navigate("/Items");
    }
    const handleOrders=()=>{
        console.log("Orders Page")
        navigate("/OrdersHistory");
    }

    const handleDeliverItems=()=>{
        console.log("Deliver Items")
        navigate("/DeliverItems");
    }
    const handleMyCart=()=>{
        console.log("My Cart")
        navigate("/MyCart");
    }
    const handleSupport=()=>{
        console.log("support")
        navigate("/Support");
    }
    const handlePricing=()=>{
        console.log("Pricing")
        navigate("/Pricing");
    }

    const handleSell=()=>{
        console.log("Sell");
        navigate("/Sell");
    }

    const handleLogout=()=>{
         console.log("Logout is clicked");
         localStorage.removeItem("token"); 
         navigate("/Login")

    }
    return(
        <>
        <nav className={styles.navbar}>
                <ul className={styles.navbar_menu}>
                    <li className={styles.navbar_menu_item} onClick={handleDashboard}>Dashboard</li>
                    <li className={styles.navbar_menu_item} onClick={handleItems}>Items</li>
                    <li className={styles.navbar_menu_item} onClick={handleOrders}>Orders History</li>
                    <li className={styles.navbar_menu_item} onClick={handleDeliverItems}>Deliver Items</li>
                    <li className={styles.navbar_menu_item} onClick={handleMyCart}>My Cart</li>
                    <li className={styles.navbar_menu_item} onClick={handleSell}>Sell</li>
                    <li className={styles.navbar_menu_item} onClick={handleSupport}>Support</li>
                    <li className={styles.navbar_menu_item} onClick={handlePricing}>Pricing</li>

                </ul>
                <button className='btn btn-danger' style={{marginRight:'40px'}}  onClick={handleLogout}>Logout</button>
            </nav>
        </>
    )
}