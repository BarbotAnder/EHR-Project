import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import Select from "react-select";
import '../../css/App.css';
import '../../css/PatientDetail.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const PatientDetails = ({ patientId }) => {
    const account_type = cookies.get('account_type');
    const [patient, setPatient] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPatient, setUpdatedPatient] = useState({});

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const id = patientId;
                const response = await axios.post('http://localhost:5000/patient-details', { id });
                const fetchedPatient = response.data.patient;

                setPatient(fetchedPatient);
                setUpdatedPatient({
                    first_name: fetchedPatient.first_name || '',
                    middle_name: fetchedPatient.middle_name || '',
                    last_name: fetchedPatient.last_name || '',
                    date_of_birth: fetchedPatient.date_of_birth || '',
                    address: fetchedPatient.address || '',
                    city: fetchedPatient.city || '',
                    state: fetchedPatient.state || '',
                    zip_code: fetchedPatient.zip_code || '',
                    phone_number: fetchedPatient.phone_number || '',
                    email: fetchedPatient.email || '',
                    insurance_provider: fetchedPatient.insurance_provider || '',
                    policy_number: fetchedPatient.policy_number || '',
                    ssn: fetchedPatient.ssn || '',
                    notes: fetchedPatient.notes || '',
                });
                setErrorMessage('');
            } catch (error) {
                setErrorMessage('Unable to fetch patient details.');
            }
        };
        fetchPatientDetails();
    }, [patientId]);

    const stateOptions = [
        { value: '', name: 'Select a State'},
        { value: 'AL', name: 'Alabama'},
        { value: 'AK', name: 'Alaska'},
        { value: 'AS', name: 'American Samoa'},
        { value: 'AZ', name: 'Arizona'},
        { value: 'AR', name: 'Arkansas'},
        { value: 'CA', name: 'California'},
        { value: 'CO', name: 'Colorado'},
        { value: 'CT', name: 'Connecticut'},
        { value: 'DE', name: 'Delaware'},
        { value: 'DC', name: 'District Of Columbia'},
        { value: 'FL', name: 'Florida'},
        { value: 'GA', name: 'Georgia'},
        { value: 'GU', name: 'Guam'},
        { value: 'HI', name: 'Hawaii'},
        { value: 'ID', name: 'Idaho'},
        { value: 'IL', name: 'Illinois'},
        { value: 'IN', name: 'Indiana'},
        { value: 'IA', name: 'Iowa'},
        { value: 'KS', name: 'Kansas'},
        { value: 'KY', name: 'Kentucky'},
        { value: 'LA', name: 'Louisiana'},
        { value: 'ME', name: 'Maine'},
        { value: 'MD', name: 'Maryland'},
        { value: 'MA', name: 'Massachusetts'},
        { value: 'MI', name: 'Michigan'},
        { value: 'MN', name: 'Minnesota'},
        { value: 'MS', name: 'Mississippi'},
        { value: 'MO', name: 'Missouri'},
        { value: 'MT', name: 'Montana'},
        { value: 'NE', name: 'Nebraska'},
        { value: 'NV', name: 'Nevada'},
        { value: 'NH', name: 'New Hampshire'},
        { value: 'NJ', name: 'New Jersey'},
        { value: 'NM', name: 'New Mexico'},
        { value: 'NY', name: 'New York'},
        { value: 'NC', name: 'North Carolina'},
        { value: 'ND', name: 'North Dakota'},
        { value: 'MP', name: 'Northern Mariana Islands'},
        { value: 'OH', name: 'Ohio'},
        { value: 'OK', name: 'Oklahoma'},
        { value: 'OR', name: 'Oregon'},
        { value: 'PA', name: 'Pennsylvania'},
        { value: 'PR', name: 'Puerto Rico'},
        { value: 'RI', name: 'Rhode Island'},
        { value: 'SC', name: 'South Carolina'},
        { value: 'SD', name: 'South Dakota'},
        { value: 'TN', name: 'Tennessee'},
        { value: 'TX', name: 'Texas'},
        { value: 'UM', name: 'United States Minor Outlying Islands'},
        { value: 'UT', name: 'Utah'},
        { value: 'VT', name: 'Vermont'},
        { value: 'VI', name: 'Virgin Islands'},
        { value: 'VA', name: 'Virginia'},
        { value: 'WA', name: 'Washington'},
        { value: 'WV', name: 'West Virginia'},
        { value: 'WI', name: 'Wisconsin'},
        { value: 'WY', name: 'Wyoming'},
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleStateChange = (e) => {
        updatedPatient.state = e.value
    };

    const handleSaveUpdates = async () => {
        try {
            if (account_type === 'patient') {
                await axios.put(`http://localhost:5000/pending-update-patient/${patientId}`, updatedPatient)
            }
            else {
                await axios.put(`http://localhost:5000/update-patient/${patientId}`, updatedPatient);
            }
            setPatient(updatedPatient);
            setIsEditing(false);
        } catch (error) {
            setErrorMessage('Unable to update patient details.');
        }
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
        setUpdatedPatient({ ...patient });
    };

    return patient ? (
        <CSSTransition key="patient-detail" timeout={300} classNames="fade">
            <div id="patient-detail">
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}
                {account_type === 'patient' && <h4>Patient Info</h4>}

                {/* Render patient details */}
                <div id='patient-details-content'>
                    <ul className="collection">
                        {/* Patient details fields */}
                        <li className="collection-item">
                            <strong>First Name:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="first_name"
                                    type="text"
                                    name="first_name"
                                    value={updatedPatient.first_name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.first_name
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Middle Name:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="middle_name"
                                    type="text"
                                    name="middle_name"
                                    value={updatedPatient.middle_name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.middle_name || 'N/A'
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Last Name:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="last_name"
                                    type="text"
                                    name="last_name"
                                    value={updatedPatient.last_name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.last_name
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Date of Birth:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={updatedPatient.date_of_birth}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.date_of_birth
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Phone:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="phone_number"
                                    type="tel"
                                    name="phone_number"
                                    value={updatedPatient.phone_number}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.phone_number
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Address:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="address"
                                    type="text"
                                    name="address"
                                    value={updatedPatient.address}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.address
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>City:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="city"
                                    type="text"
                                    name="city"
                                    value={updatedPatient.city}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.city
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>State:</strong>
                            {isEditing ? (
                                <div id='state'>
                                    <Select name="state" options={stateOptions}
                                    getOptionLabel={(options) => options['name']}
                                    getOptionValue={(options) => options['value']}
                                    defaultValue={{value: patient.state, name: stateOptions.find(item => item.value === patient.state).name}}
                                    onChange={handleStateChange}/>
                                </div>
                            ) : (
                                patient.state
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Zip Code:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="zip_code"
                                    type="text"
                                    name="zip_code"
                                    value={updatedPatient.zip_code}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.zip_code
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Insurance Provider:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="insurance_provider"
                                    type="text"
                                    name="insurance_provider"
                                    value={updatedPatient.insurance_provider}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.insurance_provider || 'N/A'
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>Policy Number:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="policy_number"
                                    type="text"
                                    name="policy_number"
                                    value={updatedPatient.policy_number}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.policy_number || 'N/A'
                            )}
                        </li>
                        <li className="collection-item">
                            <strong>SSN:</strong>
                            {isEditing ? (
                                <input
                                    data-testid="ssn"
                                    type="text"
                                    name="ssn"
                                    value={updatedPatient.ssn}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                patient.ssn || 'N/A'
                            )}
                        </li>
                    </ul>

                    <div id='edit-buttons'>
                        {isEditing ? (
                            <>
                                <button className="btn waves-effect waves-light" onClick={handleSaveUpdates}>Update</button>
                                <button className="btn waves-effect waves-light" onClick={handleCancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <button className="btn waves-effect waves-light" onClick={() => setIsEditing(true)}>Edit</button>
                        )}
                    </div>
                </div>
            </div>
        </CSSTransition>
    ) : (
        <p>There was an error loading patient details</p>
    );
};

export default PatientDetails;
