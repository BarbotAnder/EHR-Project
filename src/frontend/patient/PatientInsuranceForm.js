import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientInsuranceForm = ({ patientId }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        insurance_provider: '',
        policy_number: '',
        group_number: '',
        policy_holders_name: '',
    });

    const [insurance, setInsurance] = useState([]); // State to hold existing insurance

    useEffect(() => {
        const fetchInsurance = async () => {
            console.log(`Fetching insurance for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-insurance',
                    { patientId }
                );
                console.log('Fetched insurance response:', response.data);

                if (response.data.insurance) {
                    setInsurance(response.data.insurance); // Assuming response contains an array of insurance with additional info
                } else {
                    console.warn('No insurance found in the response:', response.data);
                    setInsurance([]); // Default to empty array if no insurance found
                }
            } catch (error) {
                console.error('Error fetching insurance:', error);
                setErrorMessage('Error fetching insurance: ' + error.message);
                setInsurance([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchInsurance(); // Fetch insurance if patientId is available
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
        const { patient_id, insurance_provider, policy_number, group_number, policy_holders_name } = formData;

        if (!insurance_provider || !policy_number || !group_number || !policy_holders_name) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient-insurance', formData);
            setFormData({
                insurance_provider: '',
                policy_number: '',
                group_number: '',
                policy_holders_name: '',
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding patient insurance:', error);
            setErrorMessage('There was an error adding patient insurance.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-insurance-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientInsuranceForm" onSubmit={handleSubmit}>
                {/* Insurance Provider */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="insurance_provider"
                            type="text"
                            name="insurance_provider"
                            className="validate"
                            value={formData.insurance_provider}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="insurance_provider" className={formData.insurance_provider ? 'active' : ''}>Insurance Provider</label>
                    </div>
                </div>

                {/* Policy Number */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="policy_number"
                            type="text"
                            name="policy_number"
                            className="validate"
                            value={formData.policy_number}
                            onChange={handleChange}
                        />
                        <label htmlFor="policy_number" className={formData.policy_number ? 'active' : ''}>Policy Number</label>
                    </div>
                </div>

                {/* Group Number */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="group_number"
                            type="text"
                            name="group_number"
                            className="validate"
                            value={formData.group_number}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="group_number" className={formData.group_number ? 'active' : ''}>Group Number</label>
                    </div>
                </div>

                {/* Policy Holder's Name */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="policy_holders_name"
                            type="text"
                            name="policy_holders_name"
                            className="validate"
                            value={formData.policy_holders_name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="policy_holders_name" className={formData.policy_holders_name ? 'active' : ''}>Policy Holder's Name</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add Patient Insurance
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
            
            {/* Display Existing Insurance */}
            <div className="existing-insurance">
                <h4>Existing Insurance</h4>
                {Array.isArray(insurance) && insurance.length > 0 ? (
                    insurance.map((existingInsurance, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingInsurance.insurance_provider}</p>
                                <p>{existingInsurance.policy_number}</p>
                                <p>{existingInsurance.group_number}</p>
                                <p>{existingInsurance.policy_holders_name}</p>
                                <small>
                                    Created on: {new Date(existingInsurance.date_created).toLocaleDateString()} <br />
                                    Last updated: {new Date(existingInsurance.last_saved_date).toLocaleDateString()} by {existingInsurance.last_saved_by}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No insurance available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientInsuranceForm;
