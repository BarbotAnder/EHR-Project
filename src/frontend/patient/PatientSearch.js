import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const PatientSearch = ({ onFormClose }) => {
    const account_type = cookies.get('account_type');
    const [searchQuery, setSearchQuery] = useState({
        dob: '',
        lastname: ''
    });
    const [patients, setPatients] = useState([]); // Store the search results
    const [errorMessage, setErrorMessage] = useState(''); // Store any error messages

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery({
            ...searchQuery,
            [name]: value
        });
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();

        const { dob, lastname } = searchQuery;

        if (!dob || !lastname) {
            setErrorMessage('Please enter both Date of Birth and Last Name.');
            return;
        }

        try {
            // Send POST request to the backend with search parameters
            const response = await axios.post('http://localhost:5000/search-patient', { dob, lastname }, {
                withCredentials:  true
            });

            // If successful, update the patients state with the returned data
            setPatients(response.data.patients);
            setErrorMessage(''); // Clear any previous error messages
        } catch (error) {
            // Handle the case when no patients are found or other errors
            if (error.response && error.response.status === 404) {
                setErrorMessage('No patients found with that Date of Birth and Last Name.');
                setPatients([]); // Clear the patient results
            } else {
                setErrorMessage('An error occurred while searching. Please try again.');
            }
        }
    };

    return (account_type === "admin" || account_type === "practitioner" || account_type === "office") ? (
        <div id="patient-search-container">
            <form onSubmit={handleSearchSubmit}>
                <h4>Search for a Patient by Date of Birth and Last Name</h4>

                {/* Date of Birth Field */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="dob"
                            type="date"
                            name="dob"
                            value={searchQuery.dob}
                            onChange={handleSearchChange}
                            required
                        />
                        <label htmlFor="dob" className={searchQuery.dob ? 'active' : ''}>Date of Birth</label>
                    </div>
                </div>

                {/* Last Name Field */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="lastname"
                            type="text"
                            name="lastname"
                            value={searchQuery.lastname}
                            onChange={handleSearchChange}
                            required
                        />
                        <label htmlFor="lastname" className={searchQuery.lastname ? 'active' : ''}>Last Name</label>
                    </div>
                </div>

                {/* Search Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Search Patient
                            <i className="material-icons right">search</i>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="row">
                        <div className="col s12">
                            <p style={{ color: 'red' }}>{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {patients.length > 0 && (
                    <div className="row">
                        <div className="col s12">
                            <h5>Search Results:</h5>
                            <ul className="collection">
                                {patients.map((patient, index) => (
                                    <li key={index} className="collection-item">
                                        {/* Link to patient detail page */}
                                        <Link to={`/patient/${patient.id}`}>
                                            {patient.first_name} {patient.middle_name} {patient.last_name} - DOB: {patient.date_of_birth} - Phone: {patient.phone_number}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Back to Dashboard Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button
                            type="button"
                            className="btn waves-effect waves-light grey"
                            onClick={onFormClose} // Close the search form
                        >
                            Back to Dashboard
                            <i className="material-icons left">arrow_back</i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    ) : (
        <div className='access-denied'><h2>ACCESS DENIED</h2></div>
    );
};

export default PatientSearch;
