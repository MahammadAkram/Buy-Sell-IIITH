import React, { useState } from 'react';
import styles from '../styles/register.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const handleLogin = () => {
        console.log("Redirecting to Login page...");
        navigate('/Login');
    };
    const [emailError, setEmailError] = useState("");
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Age: '',
        ContactNumber: '',
        Password: ''
    });

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name==="Email"){
            if(!value.endsWith("@iiit.ac.in")){
                setEmailError("Email must end with @iiit.ac.in");
            }
            else {
                setEmailError(""); 
            }
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

   

    const handleSubmit = () => {
        if (emailError) {
            alert("Please enter a valid email ending with @iiit.ac.in");
            return; 
        }
        
            console.log('Form Data:', formData);
            axios.post('http://localhost:3001/api/Register', {formData})
                .then(response => {
                    alert('User registered successfully', response.data);
                    navigate('/Login')
                    console.log("response");
                })
                .catch(error => {
                    alert('Error registering user:', error);
                });
        
    };

    return (
        <>
            <div className={styles.register}>
                <h1>Register</h1>
                <div className="input-group mb-3 my-3">
                    <input
                        type="text"
                        className="form-control-lg"
                        name="FirstName"
                        placeholder="First Name"
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.FirstName}
                    />
                    
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control-lg"
                        name="LastName"
                        placeholder="Last Name"
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.LastName}
                    />
                   
                </div>
                <div className="input-group mb-3 ">
                    <input
                        type="email"
                        className="form-control-lg"
                        name="Email"
                        placeholder="Email"
                        
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.Email}
                    />
                    
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control-lg"
                        name="Age"
                        placeholder="Age"
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.Age}
                    />
                    
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control-lg"
                        name="ContactNumber"
                        placeholder="Contact Number"
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.ContactNumber}
                    />
                    
                </div>
                <div className="input-group mb-3">
                    <input
                        type="password"
                        className="form-control-lg"
                        name="Password"
                        placeholder="Password"
                        style={{ width: '500px', backgroundColor: 'lightgray' }}
                        onChange={handleChange}
                        value={formData.Password}
                    />
                  
                </div>
                <button className={`${styles.register_button}`} onClick={handleSubmit}>Register</button>
                <p className={styles.text_login}>
                    Already have an account? <u>
                        <span className={styles.click_login} onClick={handleLogin}>Login</span>
                    </u>
                </p>
            </div>
        </>
    );
}
