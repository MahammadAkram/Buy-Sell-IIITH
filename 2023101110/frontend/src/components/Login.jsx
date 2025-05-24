import React, { useState } from 'react'; 
import styles from '../styles/login.module.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login({setUser}) {
    const navigate = useNavigate();
    const handleRegister = () => {
        console.log("Redirecting to Register page...");
        navigate('/Register');
    };

    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData((prevFormData)=>({
            ...prevFormData,
            [name]:value


        }))

    }

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        
        axios.post("http://localhost:3001/api/Login", formData)
            .then(response => {
                alert("User logged in successfully");
                
                const userDetails = response.data.user;
                localStorage.setItem('user', JSON.stringify(userDetails));
                localStorage.setItem("token", response.data.token);
                // setUser(userDetails);
                navigate('/Dashboard'); 
            })
            .catch(error => {
                alert("Login failed. Please check your credentials.");
            });
    };
    

    return (
        <>
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Please log in to your account</p>
                    <form>
                        <div className="mb-4">
                            <input 
                                type="email"
                                placeholder="Email Address"
                                className={`${styles.inputField} form-control`}
                                name="Email" 
                                onChange={handleChange} 
                                value={formData.Email}
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="password"
                                placeholder="Password"
                                className={`${styles.inputField} form-control`}
                                name="Password" 
                                onChange={handleChange}
                                value={formData.Password}
                            />
                        </div>
                        <button type="button" onClick={handleSubmitLogin} className={styles.loginButton} >Login</button>
                    </form>
                    <p className={styles.footerText}>
                        Don't have an account?{" "}
                        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleRegister}>
                            <u>Register here</u>
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}
