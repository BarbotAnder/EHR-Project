import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientEmergencyContactsForm = ({ patientId }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages

    const [formData, setFormData] = useState({
        rel: '', 
        name: '', 
        phone: '',
    });

    const [emergencyContacts, setEmergencyContacts] = useState([]); // State to hold existing emergency contacts

    useEffect(() => {
        const fetchEmergencyContacts = async () => {
            console.log(`Fetching emergency contacts for patientId: ${patientId}`);

            try {
                const response = await axios.post(
                    'http://localhost:5000/get-patient-emergency-contacts',
                    { patientId }
                );
                console.log('Fetched emergency contacts response:', response.data);

                if (response.data.ec) {
                    setEmergencyContacts(response.data.ec); // Assuming response contains an array of emergency contacts with additional info
                } else {
                    console.warn('No emergency contacts found in the response:', response.data);
                    setEmergencyContacts([]); // Default to empty array if no emergency contacts found
                }
                setErrorMessage('');
            } catch (error) {
                console.error('Error fetching emergency contacts:', error);
                setErrorMessage('Error fetching emergency contacts: ' + error.message);
                setEmergencyContacts([]); // Handle error by defaulting to empty array
            }
        };

        if (patientId) {
            fetchEmergencyContacts(); // Fetch emergency contacts if patientId is available
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
        const { patient_id, rel, name, phone } = formData;

        if (!rel || !name || !phone) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient-emergency-contacts', formData);
            setFormData({
                rel: '', 
                name: '', 
                phone: '',
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error adding patient emergency contacts:', error);
            setErrorMessage('There was an error adding patient emergency contacts.');
        }
    };

    const handleBacktoPatientPage = () => {
        navigate('/patient/'+patientId);
    };

    return (
        <div id="patient-emergency-contacts-form-container">
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form id="patientEmergencyContactsForm" onSubmit={handleSubmit}>
                {/* Emergency Contact Relationship */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="rel"
                            type="text"
                            name="rel"
                            className="validate"
                            value={formData.rel}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="rel" className={formData.rel ? 'active' : ''}>Emergency Contact Relationship</label>
                    </div>
                </div>

                {/* Emergency Contact Name */}
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
                        <label htmlFor="name" className={formData.name ? 'active' : ''}>Emergency Contact Name</label>
                    </div>
                </div>
                
                {/* Emergency Contact Phone Number */}
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
                            Add Patient Emergency Contact
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
            
            {/* Display Existing Emergency Contacts */}
            <div className="existing-emergency-contacts">
                <h4>Existing Emergency Contacts</h4>
                {Array.isArray(emergencyContacts) && emergencyContacts.length > 0 ? (
                    emergencyContacts.map((existingEmergencyContacts, index) => (
                        <div key={index} className="card note-card">
                            <div className="card-content">
                                <p>{existingEmergencyContacts.contact_relationship}</p>
                                <hr />
                                <p>{existingEmergencyContacts.contact_name}</p>
                                <p>{existingEmergencyContacts.contact_phone}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No emergency contacts available for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientEmergencyContactsForm;
