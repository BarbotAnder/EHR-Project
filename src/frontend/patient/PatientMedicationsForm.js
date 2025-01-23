import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const PatientMedicationsForm = ({ patientId }) => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');   // state for error messages
    const [formData, setFormData] = useState({
        medication: '',
        dosage: '',
        frequency: '',
    });

    const [medications, setMedications] = useState([]); // State to hold existing medications

    useEffect(() => {
        const fetchMedications = async () => {
            console.log(`Fetching medications for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-medications',
                    { patientId }
                );
                console.log('Fetched medications response:', response.data);

                if (response.data.m) {
                    setMedications(response.data.m); // Assuming response contains an array of medications with additional info
                } else {
                    console.warn('No medications found in the response:', response.data);
                    setMedications([]); // Default to empty array if no medications found
                }
            } catch (error) {
                console.error('Error fetching medications:', error);
                setErrorMessage('Error fetching medications: ' + error.message);
                setMedications([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchMedications(); // Fetch medications if patientId is available
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
        const { patient_id, medication, dosage, frequency, last_updated_by } = formData;

        if (!medication || !dosage || !frequency ) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient-medications', formData);
            setFormData({
                medication: '',
                dosage: '',
                frequency: '',
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding patient medication:', error);
            setErrorMessage('There was an error adding patient medication.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-medications-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientMedicationsForm" onSubmit={handleSubmit}>

                {/* Medication */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="medication"
                            type="text"
                            name="medication"
                            className="validate"
                            value={formData.medication}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="medication" className={formData.medication ? 'active' : ''}>Medication</label>
                    </div>
                </div>

                {/* Dosage */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="dosage"
                            type="text"
                            name="dosage"
                            className="validate"
                            value={formData.dosage}
                            onChange={handleChange}
                        />
                        <label htmlFor="dosage" className={formData.dosage ? 'active' : ''}>Dosage</label>
                    </div>
                </div>

                {/* Frequency */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="frequency"
                            type="text"
                            name="frequency"
                            className="validate"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="frequency" className={formData.frequency ? 'active' : ''}>Frequency</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add Patient Medication
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

            {/* Display Existing Medications */}
            <div className="existing-medications">
                <h4>Existing Medications</h4>
                {Array.isArray(medications) && medications.length > 0 ? (
                    medications.map((existingMedications, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingMedications.medication}</p>
                                <p>{existingMedications.dosage}</p>
                                <p>{existingMedications.frequency}</p>
                                <small>
                                    Created on: {new Date(existingMedications.date_created).toLocaleDateString()} <br />
                                    Last updated: {new Date(existingMedications.last_updated_date).toLocaleDateString()} by {existingMedications.last_updated_by}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No medications available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientMedicationsForm;
