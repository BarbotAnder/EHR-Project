import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientPage from '../../frontend/patient/PatientPage';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><PatientPage /></BrowserRouter>);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: 1 }),
}));


jest.mock('react-select', () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
            (option) => option.value === event.currentTarget.value
        );
        onChange(option);
    }
  
    return (
        <select data-testid="select" value={value} onChange={handleChange}>
            {options.map(({ name, value }) => (
            <option key={value} value={value}>
                {name}
            </option>
            ))}
        </select>
    );
});

describe('Patient Page', () => {
    test('Patient Page renders details page and tabs (with notes tab given account_type="admin")', async () => {
        const user = {
            id: 1,
            account_type: 'admin',
            email: 'admin@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });
        
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);
        
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });
       
        await waitFor(() => {
            expect(getByText("First Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.first_name)).toBeInTheDocument();
            expect(getByText("Middle Name:")).toBeInTheDocument();
            expect(getByText("N/A")).toBeInTheDocument();
            expect(getByText("Last Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.last_name)).toBeInTheDocument();
            expect(getByText("Date of Birth:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.date_of_birth)).toBeInTheDocument();
            expect(getByText("Phone:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.phone_number)).toBeInTheDocument();
            expect(getByText("Address:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.address)).toBeInTheDocument();
            expect(getByText("City:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.city)).toBeInTheDocument();
            expect(getByText("State:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.state)).toBeInTheDocument();
            expect(getByText("Zip Code:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.zip_code)).toBeInTheDocument();
            expect(getByText("Insurance Provider:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.insurance_provider)).toBeInTheDocument();
            expect(getByText("Policy Number:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.policy_number)).toBeInTheDocument();
            expect(getByText("SSN:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.ssn)).toBeInTheDocument();
           
            expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        });
    });

    test('Patient Page renders details page and tabs (with notes tab given account_type="practitioner")', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });
        
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);
        
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });
       
        await waitFor(() => {
            expect(getByText("First Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.first_name)).toBeInTheDocument();
            expect(getByText("Middle Name:")).toBeInTheDocument();
            expect(getByText("N/A")).toBeInTheDocument();
            expect(getByText("Last Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.last_name)).toBeInTheDocument();
            expect(getByText("Date of Birth:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.date_of_birth)).toBeInTheDocument();
            expect(getByText("Phone:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.phone_number)).toBeInTheDocument();
            expect(getByText("Address:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.address)).toBeInTheDocument();
            expect(getByText("City:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.city)).toBeInTheDocument();
            expect(getByText("State:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.state)).toBeInTheDocument();
            expect(getByText("Zip Code:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.zip_code)).toBeInTheDocument();
            expect(getByText("Insurance Provider:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.insurance_provider)).toBeInTheDocument();
            expect(getByText("Policy Number:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.policy_number)).toBeInTheDocument();
            expect(getByText("SSN:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.ssn)).toBeInTheDocument();
           
            expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        });
    });

    test('Patient Page renders details page and tabs (without notes tab given account_type="office")', async () => {
        const user = {
            id: 1,
            account_type: 'office',
            email: 'office@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });
        
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole, queryByText } = render(routes);
        
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(queryByText("Notes")).not.toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });
       
        await waitFor(() => {
            expect(getByText("First Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.first_name)).toBeInTheDocument();
            expect(getByText("Middle Name:")).toBeInTheDocument();
            expect(getByText("N/A")).toBeInTheDocument();
            expect(getByText("Last Name:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.last_name)).toBeInTheDocument();
            expect(getByText("Date of Birth:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.date_of_birth)).toBeInTheDocument();
            expect(getByText("Phone:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.phone_number)).toBeInTheDocument();
            expect(getByText("Address:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.address)).toBeInTheDocument();
            expect(getByText("City:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.city)).toBeInTheDocument();
            expect(getByText("State:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.state)).toBeInTheDocument();
            expect(getByText("Zip Code:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.zip_code)).toBeInTheDocument();
            expect(getByText("Insurance Provider:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.insurance_provider)).toBeInTheDocument();
            expect(getByText("Policy Number:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.policy_number)).toBeInTheDocument();
            expect(getByText("SSN:")).toBeInTheDocument();
            expect(getByText(mockDetailsResponse.data.patient.ssn)).toBeInTheDocument();
           
            expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        });
    });

    test('Patient page displays "ACCESS DENIED" given account_type="patient"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { queryByText } = render(routes);
        
        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(queryByText("Details")).not.toBeInTheDocument();
            expect(queryByText("Notes")).not.toBeInTheDocument();
            expect(queryByText("Allergies")).not.toBeInTheDocument();
            expect(queryByText("Emergency Contacts")).not.toBeInTheDocument();
            expect(queryByText("Medical History")).not.toBeInTheDocument();
            expect(queryByText("Medications")).not.toBeInTheDocument();
            expect(queryByText("Primary Care Provider(s)")).not.toBeInTheDocument();
            expect(queryByText("ACCESS DENIED")).toBeInTheDocument();
        });
    });

    test('Patient page displays "ACCESS DENIED" given account_type="inactive"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=inactive',
        });

        const { queryByText } = render(routes);
        
        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(queryByText("Details")).not.toBeInTheDocument();
            expect(queryByText("Notes")).not.toBeInTheDocument();
            expect(queryByText("Allergies")).not.toBeInTheDocument();
            expect(queryByText("Emergency Contacts")).not.toBeInTheDocument();
            expect(queryByText("Medical History")).not.toBeInTheDocument();
            expect(queryByText("Medications")).not.toBeInTheDocument();
            expect(queryByText("Primary Care Provider(s)")).not.toBeInTheDocument();
            expect(queryByText("ACCESS DENIED")).toBeInTheDocument();
        });
    });

    test('Patient page displays "ACCESS DENIED" given no account_type', async () => {

        const { queryByText } = render(routes);
        
        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/patient-details', 
            { id: 1 }
        );

        await waitFor(() => {
            expect(queryByText("Details")).not.toBeInTheDocument();
            expect(queryByText("Notes")).not.toBeInTheDocument();
            expect(queryByText("Allergies")).not.toBeInTheDocument();
            expect(queryByText("Emergency Contacts")).not.toBeInTheDocument();
            expect(queryByText("Medical History")).not.toBeInTheDocument();
            expect(queryByText("Medications")).not.toBeInTheDocument();
            expect(queryByText("Primary Care Provider(s)")).not.toBeInTheDocument();
            expect(queryByText("ACCESS DENIED")).toBeInTheDocument();
        });
    });

    test('Patient Notes is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Notes
        const mockNotesResponse = {
            data: {
                notes: []
            }
        }

        axios.post.mockResolvedValue(mockNotesResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Notes' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Notes")).toBeInTheDocument();
            expect(getByText("No notes available for this patient.")).toBeInTheDocument();
        });
    });

    test('Patient Allergies is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Allergies
        const mockAllergiesResponse = {
            data: {
                a: []
            }
        }

        axios.post.mockResolvedValue(mockAllergiesResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Allergies' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Allergies")).toBeInTheDocument();
            expect(getByText("No allergies available for this patient.")).toBeInTheDocument();
        });
    });


    test('Patient Emergency Contacts is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Medical History
        const mockEmergencyContactsResponse = {
            data: {
                ec: []
            }
        }

        axios.post.mockResolvedValue(mockEmergencyContactsResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Medical History' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Medical History")).toBeInTheDocument();
            expect(getByText("No medical history available for this patient.")).toBeInTheDocument();
        });
    });


    test('Patient Medical History is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Medical History
        const mockMedicalHistoryResponse = {
            data: {
                mh: []
            }
        }

        axios.post.mockResolvedValue(mockMedicalHistoryResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Medical History' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Medical History")).toBeInTheDocument();
            expect(getByText("No medical history available for this patient.")).toBeInTheDocument();
        });
    });


    test('Patient Medications is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Medications
        const mockMedicationsResponse = {
            data: {
                m: []
            }
        }

        axios.post.mockResolvedValue(mockMedicationsResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Medications' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Medications")).toBeInTheDocument();
            expect(getByText("No medications available for this patient.")).toBeInTheDocument();
        });
    });
    
    
    test('Patient Primary Care Provider(s) is rendered when clicked', async () => {
        const user = {
            id: 1,
            account_type: 'practitioner',
            email: 'practitioner@test.com'
        };

        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type='+user.account_type,
        });

        // Response for Patient Details
        const mockDetailsResponse = {
            data: {
                "patient": {
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2023-10-01',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111',
                    insurance_provider: 'Blue Cross',
                    policy_number: 'PN123',
                    group_number: 'GN123',
                    policy_holders_name: 'patient test',
                    notes: null,
                    date_created: null,
                    last_updated_date: null,
                    last_updated_by: null
                }
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Details")).toBeInTheDocument();
            expect(getByText("Notes")).toBeInTheDocument();
            expect(getByText("Allergies")).toBeInTheDocument();
            expect(getByText("Emergency Contacts")).toBeInTheDocument();
            expect(getByText("Medical History")).toBeInTheDocument();
            expect(getByText("Medications")).toBeInTheDocument();
            expect(getByText("Primary Care Provider(s)")).toBeInTheDocument();
        });

        // Response for Patient Primary Care Provider(s)
        const mockPCPResponse = {
            data: {
                pcp: []
            }
        }

        axios.post.mockResolvedValue(mockPCPResponse);

        act(() => {
           fireEvent.click(getByRole('button', { name: 'Primary Care Provider(s)' })); 
        });

        await waitFor(() => {
            expect(getByText("Existing Primary Care Providers")).toBeInTheDocument();
            expect(getByText("No primary care providers available for this patient.")).toBeInTheDocument();
        });
    });
});