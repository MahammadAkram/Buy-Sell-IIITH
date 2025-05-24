import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import styles from "../styles/sell.module.css";

export default function Sell() {
    const [formData, setFormData] = useState({
        Name: '',
        Price: '',
        Description: '',
        Category: '',
        SellerID: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/api/items", {
                ...formData,
                Price: Number(formData.Price),  
                SellerID: Number(formData.SellerID), 
            });

            console.log("Item added successfully:", response.data);
            alert("Item listed for sale!");
            
           
            setFormData({
                Name: '',
                Price: '',
                Description: '',
                Category: '',
                SellerID: '',
            });

        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to list item. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <h1 className={styles.heading}>Sell</h1>
            <p className={styles.details}>Enter the details of the item to sell!</p>
            <form 
                className={`${styles.container} position-absolute top-50 start-50 translate-middle border p-4`}
                onSubmit={handleSubmit}
            >
                <div className="input-group mb-3 my-3">
                    <input
                        type="text"
                        className={`${styles.inp} form-control-lg`}
                        name="Name"
                        placeholder="Item Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group mb-3 my-3">
                    <input
                        type="number"
                        className={`${styles.inp} form-control-lg`}
                        name="Price"
                        placeholder="Price"
                        value={formData.Price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group mb-3 my-3">
                    <input
                        type="text"
                        className={`${styles.inp} form-control-lg`}
                        name="Description"
                        placeholder="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group mb-3 my-3">
                    <input
                        type="text"
                        className={`${styles.inp} form-control-lg`}
                        name="Category"
                        placeholder="Category"
                        value={formData.Category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group mb-3 my-3">
                    <input
                        type="text"
                        className={`${styles.inp} form-control-lg`}
                        name="SellerID"
                        placeholder="SellerID"
                        value={formData.SellerID}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className={`${styles.sell} btn btn-danger my-3`}>Sell</button>
            </form>
        </>
    );
}
