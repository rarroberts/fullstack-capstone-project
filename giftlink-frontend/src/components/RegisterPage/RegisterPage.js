import React, { useState } from 'react';

import './RegisterPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    // useState hook variables
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 4: state for error message
    const [showerr, setShowerr] = useState('');

    // Task 5: navigate and global login state
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        console.log("Register invoked");

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/register`,
                {
                    // Step 1: POST method
                    method: 'POST',

                    // Step 1: headers
                    headers: {
                        'content-type': 'application/json',
                    },

                    // Step 1: send user details
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password
                    })
                }
            );

            // Step 2 Task 1:
            // Access data coming from the backend
            const json = await response.json();

            // Step 2 Task 2:
            // Set user details in session storage
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);

                // Step 2 Task 3:
                // Set user to logged in
                setIsLoggedIn(true);

                // Step 2 Task 4:
                // Navigate to MainPage
                navigate('/app');
            }

            // Step 2 Task 5:
            // Display backend error
            if (json.error) {
                setShowerr(json.error);
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">

                        <h2 className="text-center mb-4 font-weight-bold">
                            Register
                        </h2>

                        <div className="mb-4">
                            <label htmlFor="firstName" className="form-label">
                                FirstName
                            </label>
                            <br />
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastName" className="form-label">
                                LastName
                            </label>
                            <br />
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <br />
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <br />
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Step 2 Task 6:
                            Display error message to user */}
                        <div className="text-danger">
                            {showerr}
                        </div>

                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleRegister}
                        >
                            Register
                        </button>

                        <p className="mt-4 text-center">
                            Already a member?{' '}
                            <a href="/app/login" className="text-primary">
                                Login
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
