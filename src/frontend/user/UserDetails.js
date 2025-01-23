import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import '../../css/App.css';
import '../../css/Users.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const UserDetails = () => {
    const account_type = cookies.get('account_type');
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.post('http://localhost:5000/user-details-by-id', { id });
                const fetchedUser = response.data.user;
                setUser(fetchedUser);
                setUpdatedUser({
                    account_type: fetchedUser.account_type || '',
                    first_name: fetchedUser.first_name || '',
                    last_name: fetchedUser.last_name || '',
                    email: fetchedUser.email || '',
                });
                setErrorMessage('');
            } catch (error) {
                setErrorMessage('Unable to fetch user details.');
            }
        };
        if (account_type === 'admin') {
            fetchUserDetails();
        };
    }, [id]);

    const accountTypeOptions = [
        { value: 'patient', name: 'patient' },
        { value: 'office', name: 'office' },
        { value: 'practitioner', name: 'practitioner' }, 
        { value: 'admin', name: 'admin' },
        { value: 'inactive', name: 'inactive' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAccountTypeChange = (e) => {
        updatedUser.account_type = e.value
    };

    const handleSaveUpdates = async () => {
        try {
            await axios.put(`http://localhost:5000/update-user/${id}`, updatedUser);
            setUser(updatedUser);
            
            navigate('/user-management');
        } catch (error) {
            setErrorMessage('Unable to update user details.');
        }
    };

    const handleCancelEditing = () => {
        setUpdatedUser({ ...user });
        navigate('/user-management');
    };

    return (account_type === 'admin') ? (
        user ? (
            <div className="container-fluid">
            <div className="main-content">
                <TransitionGroup>
                    <CSSTransition key="user-detail" timeout={300} classNames="fade">
                        <div id="user-details-content">
                            <div>
                                <h4>Update User Form</h4>
                                <hr />
                            </div>
                            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                            <ul className="collection">
                                <li className="collection-item">
                                    <strong>Account Type:</strong>
                                    <div id="account_type">
                                        <Select data-testid="account_type" id="account_type" name="account_type" options={accountTypeOptions}
                                            maxMenuHeight={300}
                                            getOptionLabel={(options) => options['name']}
                                            getOptionValue={(options) => options['value']}
                                            defaultValue={{ value: user.account_type, name: accountTypeOptions.find(item => item.value === user.account_type).name }}
                                            onChange={handleAccountTypeChange}
                                            required/>
                                    </div>
                                </li>
                                <li className="collection-item">
                                    <strong>First Name:</strong>
                                    <input
                                        data-testid="first_name"
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        className="validate"
                                        value={updatedUser.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </li>
                                <li className="collection-item">
                                    <strong>Last Name:</strong>
                                    <input
                                        data-testid="last_name"
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        className="validate"
                                        value={updatedUser.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </li>
                                <li className="collection-item">
                                    <strong>Email: </strong>
                                    <input
                                        data-testid="email"
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="validate"
                                        value={updatedUser.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </li>
                            </ul>
                            <div id='edit-buttons'>
                                <button className="btn waves-effect waves-light" onClick={handleSaveUpdates}>Update</button>
                                <button className="btn waves-effect waves-light" onClick={handleCancelEditing}>Cancel</button>
                            </div>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
        ) : (
            <div>{errorMessage && <p id='errMessage'>{errorMessage}</p>}</div>
        )
    ) : (
        <div className='access-denied'><h2>ACCESS DENIED</h2></div>
    );
};

export default UserDetails;
