import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientSearch from "../patient/PatientSearch";

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><PatientSearch /></BrowserRouter>);

describe('Patient Search', () => {
    test('Patient Search renders for account_type="admin"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });
        const { getByText } = render(routes);

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('Patient Search renders for account_type="practitioner"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });
        const { getByText } = render(routes);

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('Patient Search renders for account_type="office"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });
        const { getByText } = render(routes);

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('Patient Search does not render for account_type="patient"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });
        const { queryByText } = render(routes);

        expect(queryByText('Search for a Patient by Date of Birth and Last Name')).not.toBeInTheDocument();
    });

    test('Patient Search does not render for account_type="inactive"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=inactive',
        });
        const { queryByText } = render(routes);

        expect(queryByText('Search for a Patient by Date of Birth and Last Name')).not.toBeInTheDocument();
    });

    test('Patient Search does not render for no account_type', () => {
        const { queryByText } = render(routes);

        expect(queryByText('Search for a Patient by Date of Birth and Last Name')).not.toBeInTheDocument();
    });

    test('Empty form causes pop-up message', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });
        const { getByText } = render(routes);
        
        fireEvent.click(getByText('Search Patient'));

        expect(getByText('Please enter both Date of Birth and Last Name.')).toBeInTheDocument();  // check content of error window
    });

    test('Error message displays if axios or database is not working', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });
        const { getByText, getByLabelText } = render(routes);

        await act(async () => {
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: '2001-11-11' } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: 'test' } });
            
            
            expect(getByLabelText(/Date of Birth/).value).toBe('2001-11-11');
            expect(getByLabelText(/Last Name/).value).toBe('test');

            fireEvent.click(getByText('Search Patient'));
        });
        expect(getByText('An error occurred while searching. Please try again.')).toBeInTheDocument();
    });

    test('Valid form displays error message when no patients are found.', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });
        const invalidPatient = { dob: '2001-11-11', last_name: 'test' };
        const { getByText, getByLabelText } = render(routes);

        const mockResponse = {
            "response": {
                "status": 404
            }
        };
        
        axios.post.mockRejectedValue(mockResponse);

        await waitFor(async () => {
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: invalidPatient.dob } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: invalidPatient.last_name } });
            
            expect(getByLabelText(/Date of Birth/).value).toBe(invalidPatient.dob);
            expect(getByLabelText(/Last Name/).value).toBe(invalidPatient.last_name);

            fireEvent.click(getByText('Search Patient'));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/search-patient', 
                                                {dob: invalidPatient.dob, lastname: invalidPatient.last_name},
                                                {"withCredentials": true}
        );

        await waitFor(() => {
            expect(getByText('No patients found with that Date of Birth and Last Name.')).toBeInTheDocument();
        });
    });

    test('Valid form displays patient link when patients are found.', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });
        const validPatient = { dob: '2001-11-11', last_name: 'test' };
        const { getByText, getByLabelText } = render(routes);

        const mockResponse = {
            data: {
                "patients": [{
                    id: 1,
                    first_name: 'patient',
                    middle_name: '',
                    last_name: 'test',
                    date_of_birth: '2001-11-11',
                    address: '1910 W University Dr',
                    city: 'Boise',
                    state: 'ID',
                    zip_code: '83725',
                    phone_number: '208-777-7777',
                    email: 'patient@test.com',
                    ssn: '519-65-1111'
                }]
            }
        };
        
        axios.post.mockResolvedValue(mockResponse);
        expect(mockResponse.data.patients).toHaveLength(1);

        await waitFor(async () => {
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: validPatient.dob } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: validPatient.last_name } });
            
            expect(getByLabelText(/Date of Birth/).value).toBe(validPatient.dob);
            expect(getByLabelText(/Last Name/).value).toBe(validPatient.last_name);

            fireEvent.click(getByText('Search Patient'));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/search-patient', 
                                                {dob: validPatient.dob, lastname: validPatient.last_name},
                                                {"withCredentials": true}
        );

        await waitFor(() => {
            expect(getByText('Search Results:')).toBeInTheDocument();
            expect(getByText('patient test - DOB: 2001-11-11 - Phone: 208-777-7777')).toBeInTheDocument();
        });
    });
});