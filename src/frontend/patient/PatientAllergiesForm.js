import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientAllergiesForm = ({ patientId }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages
    
    const [formData, setFormData] = useState({
        allergy: '',
    });

    const [allergies, setAllergies] = useState([]); // State to hold existing allergies

    useEffect(() => {
        const fetchAllergies = async () => {
            console.log(`Fetching allergies for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-allergies',
                    { patientId }
                );
                console.log('Fetched allergies response:', response.data);

                if (response.data.a) {
                    setAllergies(response.data.a); // Assuming response contains an array of allergies with additional info
                } else {
                    console.warn('No allergies found in the response:', response.data);
                    setAllergies([]); // Default to empty array if no allergies found
                }
            } catch (error) {
                console.error('Error fetching allergies:', error);
                setErrorMessage('Error fetching allergies: ' + error.message);
                setAllergies([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchAllergies(); // Fetch allergies if patientId is available
        }
    }, [patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        formData.patient_id = patientId;    // assign patientId
        const { patient_id, allergy } = formData;

        if (!allergy) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            const response = await axios.post('http://localhost:5000/add-patient-allergy', formData);
            setFormData({
                allergy: '',
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding patient allergy:', error);
            setErrorMessage('There was an error adding patient allergy.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-allergy-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientAllergiesForm" onSubmit={handleSubmit}>
                {/* Allergy */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="allergy"
                            type="text"
                            name="allergy"
                            className="validate"
                            value={formData.allergy}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="allergy" className={formData.allergy ? 'active' : ''}>Enter an allergy...</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add Patient Allergy
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>

                {/* Back to Patient Page Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button
                            type="button"
                            className="btn waves-effect waves-light grey"
                            onClick={handleBacktoPatientPage} // Use handleBacktoPatientPage for back button
                        >
                            Back to Patient Page
                            <i className="material-icons left">arrow_back</i>
                        </button>
                    </div>
                </div>
            </form>

            {/* Display Existing Allergies */}
            <div className="existing-allergies">
                <h4>Existing Allergies</h4>
                {Array.isArray(allergies) && allergies.length > 0 ? (
                    allergies.map((existingAllergies, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingAllergies.allergy}</p>
                                <small>
                                    Created on: {new Date(existingAllergies.date_created).toLocaleDateString()} <br />
                                    Last updated: {new Date(existingAllergies.last_updated_date).toLocaleDateString()} by {existingAllergies.last_updated_by}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No allergies available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientAllergiesForm;
