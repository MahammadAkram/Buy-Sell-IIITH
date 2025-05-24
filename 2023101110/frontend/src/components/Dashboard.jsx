import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/dashboard.module.css';
import PropTypes from 'prop-types'
import Navbar from './Navbar';



export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Age: '',
        Email: '',
        ContactNumber: '',
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/Login'); // Redirect to login if no user is logged in
        } else {
            setUser(userData); // Set user data in state
            setFormData({
                FirstName: userData.FirstName || '',
                LastName: userData.LastName || '',
                Age: userData.Age || '',
                Email: userData.Email || '',
                ContactNumber: userData.ContactNumber || '',
            });
        }
    }, [navigate]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/UpdateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('User details updated successfully!');
              
                localStorage.setItem('user', JSON.stringify(result.updatedUser));
                setUser(result.updatedUser); 
            } else {
                const error = await response.json();
                alert(`Failed to update user: ${error.message}`);
            }
        } catch (err) {
            console.error('Error updating user details:', err);
            alert('An error occurred while updating user details.');
        }
    };



    const handleItems = () => {
        navigate("/Items");

    };

    return (
        <>
            <Navbar />
            <h1 className={styles.welcome}>Welcome   <span className={styles.username}>{formData.FirstName}</span></h1>
            {user && (
                <div className={styles.edit_container}>

                    <form >
                        <label className={styles.edit}>

                            <div>
                                <span className={styles.span} style={{marginRight:'120px'}}>FirstName :  </span> <input type='text' name="FirstName" value={formData.FirstName} className={styles.edit} onChange={handleChange} />
                            </div>
                            <div>
                                <span className={styles.span} style={{marginRight: '126px'}}>LastName :</span><input type='text' name="LastName" value={formData.LastName} className={styles.edit} onChange={handleChange} />
                            </div>
                            <div>
                                <span className={styles.span} style={{marginRight:'164px'}}>Email :</span><input type='text' name="Email" value={formData.Email} className={styles.edit} onChange={handleChange} />
                            </div>
                            <div>
                                <span className={styles.span} style={{marginRight:'181px'}}>Age :</span><input type='text' name="Age" value={formData.Age} className={styles.edit} onChange={handleChange} />
                            </div>
                            <div>
                                <span className={styles.span} style={{marginRight:'72px'}}>ContactNumber :</span> <input type='text' name="ContactNumber" value={formData.ContactNumber} className={styles.edit} onChange={handleChange} />
                            </div>



                        </label>
                        <button type='submit' className='btn btn-danger my-5' onClick={handleSaveChanges} style={{display:'block',marginLeft:'120px'}}>Save Changes</button>

                        
                    </form>
                </div>



            )}
        </>
    );
}
