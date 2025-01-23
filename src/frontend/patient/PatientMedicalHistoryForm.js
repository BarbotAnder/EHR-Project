import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const PatientMedicalHistoryForm = ({ patientId }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        notes: '',
    });
    
    const [medicalHistory, setMedicalHistory] = useState([]); // State to hold existing medical history

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            console.log(`Fetching medical history for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-medical-history',
                    { patientId }
                );
                console.log('Fetched medical history response:', response.data);

                if (response.data.mh) {
                    setMedicalHistory(response.data.mh); // Assuming response contains an array of medical history with additional info
                } else {
                    console.warn('No medical history found in the response:', response.data);
                    setMedicalHistory([]); // Default to empty array if no medical history found
                }
            } catch (error) {
                console.error('Error fetching medical history:', error);
                setErrorMessage('Error fetching medical history: ' + error.message);
                setMedicalHistory([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchMedicalHistory(); // Fetch medical history if patientId is available
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
        formData.last_updated_by = cookies.get('user_id');
        const { patient_id, notes, last_updated_by } = formData;

        if (!notes) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient-medical-history', formData);
            setFormData({
                notes: '',
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding patient medical history:', error);
            setErrorMessage('There was an error adding patient medical history.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-medical-history-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientMedicalHistoryForm" onSubmit={handleSubmit}>
                {/* Notes */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="notes"
                            type="text"
                            name="notes"
                            className="validate"
                            value={formData.notes}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="notes" className={formData.notes ? 'active' : ''}>Enter Medical History...</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add Patient Medical History
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

            {/* Display Existing Medical History */}
            <div className="existing-medical-history">
                <h4>Existing Medical History</h4>
                {Array.isArray(medicalHistory) && medicalHistory.length > 0 ? (
                    medicalHistory.map((existingMedicalHistory, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingMedicalHistory.notes}</p>
                                <small>
                                    Created on: {new Date(existingMedicalHistory.date_created).toLocaleDateString()} <br />
                                    Last updated: {new Date(existingMedicalHistory.last_updated_date).toLocaleDateString()} by {existingMedicalHistory.last_updated_by}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No medical history available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientMedicalHistoryForm;
