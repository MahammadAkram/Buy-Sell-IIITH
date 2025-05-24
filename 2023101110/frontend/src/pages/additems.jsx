import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
const AddItemForm = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Price: "",
        Description: "",
        Category: ""
    });

    const [message, setMessage] = useState("");

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); 

        if (!token) {
            setMessage("Unauthorized: No token found. Please login.");
            return;
        }

        try {
            const response = await axios.post(" http://localhost:3001/api/additems", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.ok){
                setMessage(response.data.message);
                setFormData({ Name: "", Price: "", Description: "", Category: "" }); 
                
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error adding item");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="form-container">
            <h2>Add New Item</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />

                <label>Price:</label>
                <input type="text" name="Price" value={formData.Price} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="Description" value={formData.Description} onChange={handleChange} required />

                <label>Category:</label>
                <input type="text" name="Category" value={formData.Category} onChange={handleChange} required />

                <button type="submit">Add Item</button>
            </form>
        </div>
        </>
    );
};

export default AddItemForm;
