import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function DeliverItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const user = localStorage.getItem("token");
                console.log("User Token:", user);
                const response = await axios.get(`http://localhost:3001/api/orders/pendingitems`, {
                    headers: {
                        Authorization: `Bearer ${user}`
                    }
                });
                console.log("Fetched Data:", response.data);
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
                setError(error.response?.data?.message || "Failed to fetch items");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <>
            <Navbar />
            <h1>Deliver Items</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {items.length > 0 ? (
                    items.map((item) => (
                        <li key={item._id}>
                            <strong>Item ID:</strong> {item.Amount} <br />

                            <strong>Buyer ID:</strong> {item.BuyerID}
                        </li>
                    ))
                ) : (
                    !loading && <p>No pending items found.</p>
                )}
            </ul>
        </>
    );
}
