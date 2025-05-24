import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/itemdetails.module.css";

export default function ItemDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);

    const handleCart = async () => {
        try {
            const token = localStorage.getItem("token"); 
    
            if (!token) {
                alert("Please login first.");
                navigate("/Login");
                return;
            }
            console.log(id);
            const cartResponse = await axios.post(
                "http://localhost:3001/api/cart/add",
                { itemId: id },
                { headers: { Authorization: `Bearer ${token}` } } 
            );
    
            alert(cartResponse.data.message);
            navigate("/MyCart");
        } catch (err) {
            console.error("Error adding item to cart:", err);
            alert("Failed to add item to cart.");
        }
    };
    


    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/Items/${id}`);

                setItem(response.data);
            } catch (err) {
                console.error("Error fetching item details:", err);
                setError("Failed to fetch item details");
            }
        };

        if (id) fetchItemDetails();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>{item?.Name}</h1>
                    <p><strong>Price:</strong> ${item?.Price}</p>
                    <p><strong>Description:</strong> {item?.Description}</p>
                    <p><strong>Category:</strong> {item?.Category}</p>
                    <p><strong>Seller ID:</strong> {item?.SellerID}</p>
                    <button className="btn btn-primary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                    <button className="btn btn-success" style={{ marginLeft: '30px' }} onClick={handleCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </>
    );
}
