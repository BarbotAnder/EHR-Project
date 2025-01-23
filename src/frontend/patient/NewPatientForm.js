import React, { useState } from 'react';
import axios from 'axios';
import Select from "react-select";

const NewPatientForm = ({ onFormClose }) => {
    const [errorMessage, setErrorMessage] = useState('');   // state for error messages
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone_number: '',
        email: '',
        ssn: '',
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStateChange = (e) => {
        formData.state = e.value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstname, middlename, lastname, dob, address, city, state, zip_code, phone_number, email, ssn } = formData;

        if (!firstname || !lastname || !dob || !address || !city || !state || !zip_code || !phone_number || !email || !ssn) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        try {
            // Make a POST request to the backend
            await axios.post('http://localhost:5000/add-patient', formData, {
                withCredentials: true, // Allows cookies (JWT token) to be sent with the request
            });

            setFormData({
                firstname: '',
                middlename: '',
                lastname: '',
                dob: '',
                address: '',
                city: '',
                state: '',
                zip_code: '',
                phone_number: '',
                email: '',
                ssn: '',
            });
            
            setErrorMessage('');
            onFormClose(); // Navigate back to the dashboard after form submission
        } catch (error) {
            if (error.response && error.response.status === 304) {
                setErrorMessage('Email is already associated with a patient.');
            }
            else if (error.response && error.response.status === 305) {
                setErrorMessage('SSN is already associated with a patient.');
            }
            else {
                setErrorMessage('There was an error adding the patient.');
            }
        }
    };

    return (
        <div id="new-patient-form-container">
            <form id="newPatientForm" onSubmit={handleSubmit}>
                <h4>New Patient Form</h4>
                
                {errorMessage && <p id='errMessage'>{errorMessage}</p>}

                {/* First Name */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="firstname"
                            type="text"
                            name="firstname"
                            className="validate"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="firstname" className={formData.firstname ? 'active' : ''}>First Name</label>
                    </div>
                </div>

                {/* Middle Name */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="middlename"
                            type="text"
                            name="middlename"
                            className="validate"
                            value={formData.middlename}
                            onChange={handleChange}
                        />
                        <label htmlFor="middlename" className={formData.middlename ? 'active' : ''}>Middle Name</label>
                    </div>
                </div>

                {/* Last Name */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="lastname"
                            type="text"
                            name="lastname"
                            className="validate"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="lastname" className={formData.lastname ? 'active' : ''}>Last Name</label>
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="dob"
                            type="date"
                            name="dob"
                            className="validate"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="dob" className={formData.dob ? 'active' : ''}>Date of Birth</label>
                    </div>
                </div>

                {/* Address */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="address"
                            type="text"
                            name="address"
                            className="validate"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="address" className={formData.address ? 'active' : ''}>Address</label>
                    </div>
                </div>

                {/* City */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="city"
                            type="text"
                            name="city"
                            className="validate"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="city" className={formData.city ? 'active' : ''}>City</label>
                    </div>
                </div>

                {/* State */}
                <div className="row">
                    <div className="input-field col s12">
                        <Select data-testid="stateSelect" id="state" name="state" options={stateOptions}
                            getOptionLabel={(options) => options['name']}
                            getOptionValue={(options) => options['value']}
                            defaultValue={{value:"", name:"Select a State"}}
                            onChange={handleStateChange}
                            required/>
                    </div>
                </div>

                {/* Zip Code */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="zip_code"
                            type="text"
                            name="zip_code"
                            className="validate"
                            value={formData.zip_code}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="zip_code" className={formData.zip_code ? 'active' : ''}>Zip Code</label>
                    </div>
                </div>

                {/* Phone Number */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="phone_number"
                            type="tel"
                            name="phone_number"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            className="validate"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="phone_number" className={formData.phone_number ? 'active' : ''}>
                            Phone Number (000-000-0000)
                        </label>
                    </div>
                </div>

                {/* Email */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="validate"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email" className={formData.email ? 'active' : ''}>Email</label>
                    </div>
                </div>

                {/* SSN */}
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            id="ssn"
                            type="text"
                            name="ssn"
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                            className="validate"
                            value={formData.ssn}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="ssn" className={formData.ssn ? 'active' : ''}>
                            SSN (000-00-0000)
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button type="submit" className="btn waves-effect waves-light">
                            Add New Patient
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>

                {/* Back to Dashboard Button */}
                <div className="row">
                    <div className="col s12 center-align">
                        <button
                            type="button"
                            className="btn waves-effect waves-light grey"
                            onClick={onFormClose} // Use onFormClose for back button
                        >
                            Back to Dashboard
                            <i className="material-icons left">arrow_back</i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewPatientForm;