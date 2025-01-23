import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
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

        formData.account_type = "patient";
        const { account_type, firstName, lastName, email, password, repeatPassword } = formData;

        if (!firstName || !lastName || !email || !password || !repeatPassword) {
            setErrorMessage('Please fill out required fields.');
            return;
        }

        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-user', formData);
            
            navigate('/');  // navigate back to login

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                repeatPassword: '',  // Reset repeatPassword too
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding user:', error);
            if (error.response && error.response.status === 305) {
                setErrorMessage('Email is already associated with an account.');
            }
            else {
                setErrorMessage('There was an error adding the user.');
            }
        }
    };

    return (
        <div>
            <h2 className="center-align">Sign Up</h2>
            <div className="container">
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                <form id="signupForm" className="col s12" onSubmit={handleSubmit} autoComplete="off">
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">account_circle</i>
                            <input
                                id="first_name"
                                type="text"
                                name="firstName"
                                className="validate"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="first_name">First Name</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">account_circle</i>
                            <input
                                id="last_name"
                                type="text"
                                name="lastName"
                                className="validate"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="last_name">Last Name</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">email</i>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="validate"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">Email</label>
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
                        <div className="input-field col s12">
                            <i className="material-icons prefix">lock</i>
                            <input
                                id="repeat_password"
                                type="password"
                                name="repeatPassword"
                                className="validate"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="repeat_password">Repeat Password</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 center-align">
                            <button type="submit" className="btn waves-effect waves-light">
                                Sign Up
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>

                    {/* Back to Login button */}
                    <div className="row">
                        <div className="col s12 center-align">
                            <Link to="/" className="btn-flat waves-effect waves-light">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
