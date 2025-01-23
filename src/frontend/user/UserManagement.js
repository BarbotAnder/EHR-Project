import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../../css/App.css';
import '../../css/Users.css';

const cookies = new Cookies();

const UserManagement = () => {
    const account_type = cookies.get('account_type');
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    // get all users
    useEffect(() => {
        const fetchUsers = async () => {
            console.log(`Fetching all users.`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-all-users'
                );
                console.log('Fetched users response:', response.data);

                if (response.data.users) {
                    setUsers(response.data.users); // Assuming response contains an array of users with additional info
                } else {
                    console.warn('No users found in the response:', response.data);
                    setUsers([]); // Default to empty array if no users are found
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setErrorMessage('Error fetching users: ' + error.message);
                setUsers([]); // Handle error by defaulting to empty array
            }
        };

        if (account_type === 'admin') {
            fetchUsers();
        }
    }, []);

    // display all users
    return (account_type === 'admin') ? (
        <div className="container-fluid">
            <div className="main-content">
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                <TransitionGroup>
                    <CSSTransition key="user-management" timeout={300} classNames="fade">
                        <div className='existing-users'>
                            <h3>Users:</h3>
                            <hr />
                            {Array.isArray(users) && users.length > 0 ? (
                            users.map((existingUser, index) => (
                                <div key={index} className="card note-card">
                                    <div className="card-content">
                                        <Link to={`/users/${existingUser.id}`}>
                                            <p>Account Type: {existingUser.account_type}</p>
                                            <hr />
                                            <p>First Name: {existingUser.first_name}</p>
                                            <p>Last Name: {existingUser.last_name}</p>
                                            <p>Email: {existingUser.email}</p>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No users were found.</p>
                        )}
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    ) : (
        <div className='access-denied'><h2>ACCESS DENIED</h2></div>
    );
};

export default UserManagement;
