import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/reset-password', { email });
            setMessage('A password reset link has been sent to your email.');
        } catch (err) {
            console.error('There was an error sending the reset password link:', err);
            setErrorMessage('There was an error sending the reset password link. Please try again.');
        }
    };

    return (
        <div>
            <h2 className="center-align">Reset Password</h2>
            <div className="container">
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">email</i>
                            <input
                                id="email"
                                type="email"
                                className="validate"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 center-align">
                            <button type="submit" className="btn waves-effect waves-light">
                                Send Reset Link
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="row">
                            <div className="col s12 center-align">
                                <p>{message}</p>
                            </div>
                        </div>
                    )}
                </form>

                {/* Back to Login button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <Link to="/" className="btn-flat waves-effect waves-light">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
