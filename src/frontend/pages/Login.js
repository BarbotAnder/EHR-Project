import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Login = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password } = formData;

        if (!username || !password) {
            setErrorMessage('Please fill out required fields.');
            return;
        }

        // Make a POST request to the backend
        try {
            const response = await axios.post('http://localhost:5000/validate-user-login', formData, {
                withCredentials: true
            });

            setErrorMessage('');

            // Store the username in localStorage
            localStorage.setItem('username', username);

            localStorage.setItem('loggedIn', 'true');

            // Pass the username to the dashboard via query params (or state management solution)
            navigate(`/dashboard?username=${username}`);
            
            // Store user info in cookies
            cookies.set('user_id', response.data.valid.id, {secure:true, sameSite:true});
            cookies.set('username', response.data.valid.email, {secure:true, sameSite:true});
            cookies.set('account_type', response.data.valid.account_type, {secure:true, sameSite:true});
            cookies.set('email', response.data.valid.email, {secure:true, sameSite:true});
            cookies.set('session_token', response.data.valid.id, {secure:true, sameSite:true});
            if (response.data.valid.account_type === 'patient') { cookies.set('patient_id', response.data.valid.patient_id, {secure:true, sameSite:true}); }

            // reset form
            setFormData({
                username: '',
                password: '',
            });
        } catch (error) {
            console.error('There was an error logging in:', error);
            if (error.response && error.response.status === 404) {
                setErrorMessage('Invalid username and/or password.');
            }
            else {
                setErrorMessage('An error occurred while logging in.');
            }
        }
    };

    return (
        <div>
            <h2 className="center-align">Login</h2>
            <div className="container">
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                <form id="loginForm" className="col s12" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">account_circle</i>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                className="validate"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">lock</i>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="validate"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 center-align">
                            <button type="submit" className="btn waves-effect waves-light">
                                Login
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <div className="row">
                        <div className="col s12 center-align">
                            <Link to="/signup" className="btn-flat waves-effect waves-light">
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    {/* Reset Password Link */}
                    <div className="row">
                        <div className="col s12 center-align">
                            <Link to="/reset-password" className="btn-flat waves-effect waves-light">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
