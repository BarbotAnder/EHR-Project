import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientPrimaryCareProvidersForm = ({ patientId }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        name: '', 
        phone: '',
    });

    const [primaryCareProviders, setPrimaryCareProviders] = useState([]); // State to hold existing primaryCareProviders

    useEffect(() => {
        const fetchPrimaryCareProviders = async () => {
            console.log(`Fetching primary care providers for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-primary-care-providers ',
                    { patientId }
                );
                console.log('Fetched primary care providers response:', response.data);

                if (response.data.pcp) {
                    setPrimaryCareProviders(response.data.pcp); // Assuming response contains an array of primary care providers with additional info
                } else {
                    console.warn('No primary care providers found in the response:', response.data);
                    setPrimaryCareProviders([]); // Default to empty array if no primary care providers found
                }
                setErrorMessage('');
            } catch (error) {
                console.error('Error fetching primary care providers', error);
                setErrorMessage('Error fetching primary care providers ' + error.message);
                setPrimaryCareProviders([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchPrimaryCareProviders(); // Fetch primary care providers if patientId is available
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

        const { patient_id, name, phone } = formData;

        if (!name || !phone) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient-primary-care-providers', formData);
            setFormData({
                name: '', 
                phone: '',
            });
            // handleBacktoPatientPage(); // Navigate back to the patient page after form submission
        } catch (error) {
            console.error('There was an error adding patient primary care provider:', error);
            setErrorMessage('There was an error adding patient primary care provider.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-primary-care-providers-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientPrimaryCareProvidersForm" onSubmit={handleSubmit}>

                {/* Primary Care Provider Name */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className="validate"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <label htmlFor="name" className={formData.name ? 'active' : ''}>Primary Care Provider Name</label>
                    </div>
                </div>
                
                {/* Primary Care Provider Phone Number */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            className="validate"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="phone" className={formData.phone ? 'active' : ''}>
                            Phone Number (000-000-0000)
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add Patient Primary Care Provider
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

            {/* Display Existing primary care providers */}
            <div className="existing-primary-care-providers ">
                <h4>Existing Primary Care Providers</h4>
                {Array.isArray(primaryCareProviders) && primaryCareProviders.length > 0 ? (
                    primaryCareProviders.map((existingPrimaryCareProviders, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingPrimaryCareProviders.physician_name}</p>
                                <p>{existingPrimaryCareProviders.physician_phone}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No primary care providers available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientPrimaryCareProvidersForm;
