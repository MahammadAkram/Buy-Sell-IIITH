import React, { useEffect } from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard'
import Items from './pages/Items'
import OrdersHistory from './pages/OrdersHistory';
import MyCart from './pages/Mycart';
import axios from 'axios';
import DeliverItems from './pages/DeliverItems'
import ItemDetails from './pages/ItemsDetails';
import Sell from './pages/Sell';
import ProtectedRoute from './components/ProtectedRoute';
import AddItemForm from './pages/additems'

import { useState } from 'react';


function App() {
    const [items, setItems] = useState([]); // All items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/Items');
                console.log('Items fetched:', response.data.items);
                setItems(response.data.items);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch items');
            }
        };

        fetchItems();
    }, []);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                <Route path="/Items" element={<ProtectedRoute><Items /></ProtectedRoute>}/>
                <Route path="/OrdersHistory" element={<ProtectedRoute><OrdersHistory /></ProtectedRoute>}/>
                <Route path="/DeliverItems" element={<ProtectedRoute>< DeliverItems/></ProtectedRoute>}/>
                <Route path="/MyCart" element={<ProtectedRoute><MyCart /></ProtectedRoute>}/>
                <Route path="/Items" element={<ProtectedRoute><Items /></ProtectedRoute>}/>
                <Route path="/Items/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
                {/* <Route path="/Sell" element={<ProtectedRoute><Sell/></ProtectedRoute>}/> */}
                <Route path="/Sell" element={<ProtectedRoute> <AddItemForm/> </ProtectedRoute>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
