import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <div className="container text-center mt-5" style={{ padding: '20vh' }}>
                <h1 className="text-primary">Welcome to My Website!!</h1>
                <p className="lead">Please login or register to continue.</p>
                <div className="d-flex justify-content-center mt-4">
                    <Link to="/Login">
                        <button className="btn btn-primary mx-2">Login</button>
                    </Link>
                    <Link to="/Register">
                        <button className="btn btn-success mx-2">Register</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
