  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import Navbar from '../components/Navbar';

  const Orders = () => {
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem("token");
          // console.log("User Token:", token);

          if (!token) {
            throw new Error("No token found. Please log in.");
          }

          
          const response = await axios.get(`http://localhost:3001/api/orders/pending-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const pendingRes = response.data.pendingOrders;
          // console.log("Pending Orders:", pendingRes);
          setPendingOrders(pendingRes); 
        } catch (error) {
          console.error("Error fetching orders:", error.response?.data || error.message);
        }
      };

      fetchOrders();
    }, []); 

    return (
      <div>
        <Navbar />
        <h2>Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p>No pending orders.</p>
        ) : (
          <ul>
            {pendingOrders.map(order => (
              <li key={order._id}>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Amount:</strong> {order.Amount}</p>
                <p><strong>Buyer ID:</strong> {order.BuyerID}</p>
                <p><strong>Item ID:</strong> {order.ItemID}</p>
                <p><strong>Seller ID:</strong> {order.SellerID}</p>
                <p><strong>Status:</strong> {order.Status}</p>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  export default Orders;
