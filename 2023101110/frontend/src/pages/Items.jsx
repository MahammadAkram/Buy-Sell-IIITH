import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import styles from '../styles/items.module.css';
import { useNavigate } from 'react-router-dom';

export default function Items() {
    const [items, setItems] = useState([]); 
    const [filteredItems, setFilteredItems] = useState([]); 
    const [error, setError] = useState(null); 
    const [filters, setFilters] = useState({
        Name: '',
        Category: '',
        PriceRange: '',
    }); 
    const navigate = useNavigate();
   
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/Items');
                console.log('Items fetched:', response.data.items);
                setItems(response.data.items);
                setFilteredItems(response.data.items); 
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch items');
            }
        };

        fetchItems();
    }, []);

    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    
    const applyFilters = () => {
        const { Name, Category, PriceRange } = filters;

        const filtered = items.filter((item) => {
            const matchesName = Name ? item.Name.toLowerCase().includes(Name.toLowerCase()) : true;
            const matchesCategory = Category ? item.Category.toLowerCase() === Category.toLowerCase() : true;
            const matchesPrice =
                PriceRange === 'low'
                    ? item.Price < 50
                    : PriceRange === 'medium'
                    ? item.Price >= 50 && item.Price <= 100
                    : PriceRange === 'high'
                    ? item.Price > 100
                    : true;

            return matchesName && matchesCategory && matchesPrice;
        });

        setFilteredItems(filtered);
    };


    const handleClick=(item)=>{
        navigate(`/Items/${item._id}`)
    }

    return (
        <>
            <Navbar />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.filter_container}>
                <h2>Filter Items</h2>
                <input
                    type="text"
                    name="Name"
                    placeholder="Search by Name"
                    value={filters.Name}
                    onChange={handleFilterChange}
                    className={styles.filter_input}
                />
                <select
                    name="Category"
                    value={filters.Category}
                    onChange={handleFilterChange}
                    className={styles.filter_input}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Gaming">Gaming</option>

                    


                </select>
                <select
                    name="PriceRange"
                    value={filters.PriceRange}
                    onChange={handleFilterChange}
                    className={styles.filter_input}
                >
                    <option value="">All Prices</option>
                    <option value="low">Below $50</option>
                    <option value="medium">$50 - $100</option>
                    <option value="high">Above $100</option>
                </select>
                <button type="button" onClick={applyFilters} className="btn btn-primary">
                    Search
                </button>
            </div>

            <div className={styles.first}>
                {filteredItems.map((item) => (
                    <div key={item._id} className={styles.second}>
                        <h3>{item.Name}</h3>
                        <p>
                            <strong>Price:</strong> ${item.Price}
                        </p>
                        <p>
                            <strong>Description:</strong> {item.Description}
                        </p>
                        <p>
                            <strong>Category:</strong> {item.Category}
                        </p>
                        <p>
                            <strong>Seller ID:</strong> {item.SellerID}
                        </p>
                        <button type="button" className="btn btn-success" onClick={() => handleClick(item)}>
                            Click here to view
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
