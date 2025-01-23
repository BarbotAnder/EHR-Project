import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientDetails from '../patient/PatientDetails';

// test('', () => {});

jest.mock('axios');

const patient = {
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
    notes: ''
}

const updatedPatient = {
    first_name: 'Buster',
    middle_name: 'Boise',
    last_name: 'Bronco',
    date_of_birth: '2023-11-11',
    address: '1903 W Michigan Ave',
    city: 'Kalamazoo',
    state: 'MI',
    zip_code: '49008',
    phone_number: '269-387-1000',
    email: 'patient@test.com',
    ssn: '519-65-1234',
    insurance_provider: 'Regence',
    policy_number: 'PN1234',
    notes: ''
}

const routes = (<BrowserRouter><PatientDetails patientId={patient.id}/></BrowserRouter>);

jest.mock('react-select', () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
            (option) => option.value === event.currentTarget.value
        );
        onChange(option);
    }

    return (
        <select data-testid='state' defaultValue={patient.state} value={value} onChange={handleChange}>
            {options.map(({ name, value }) => (
                <option key={value} value={value}>
                    {name}
                </option>
            ))}
        </select>
    );
});

describe('Patient Details', () => {
    test('Patient Details renders', async () => {
        const mockDetailsResponse ={
            data: { patient }
        }

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, queryByRole } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', { id: patient.id } );

        await waitFor(() => {
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByText(patient.first_name)).toBeInTheDocument();
            expect(getByText('Middle Name:')).toBeInTheDocument();
            expect(getByText('N/A')).toBeInTheDocument();
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByText(patient.last_name)).toBeInTheDocument();
            expect(getByText('Date of Birth:')).toBeInTheDocument();
            expect(getByText(patient.date_of_birth)).toBeInTheDocument();
            expect(getByText('Phone:')).toBeInTheDocument();
            expect(getByText(patient.phone_number)).toBeInTheDocument();
            expect(getByText('Address:')).toBeInTheDocument();
            expect(getByText(patient.address)).toBeInTheDocument();
            expect(getByText('City:')).toBeInTheDocument();
            expect(getByText(patient.city)).toBeInTheDocument();
            expect(getByText('State:')).toBeInTheDocument();
            expect(getByText(patient.state)).toBeInTheDocument();
            expect(getByText('Zip Code:')).toBeInTheDocument();
            expect(getByText(patient.zip_code)).toBeInTheDocument();
            expect(getByText('Insurance Provider:')).toBeInTheDocument();
            expect(getByText(patient.insurance_provider)).toBeInTheDocument();
            expect(getByText('Policy Number:')).toBeInTheDocument();
            expect(getByText(patient.policy_number)).toBeInTheDocument();
            expect(getByText('SSN:')).toBeInTheDocument();
            expect(getByText(patient.ssn)).toBeInTheDocument();
            expect(queryByRole('button', { name: 'Edit' })).toBeInTheDocument();
            expect(queryByRole('button', { name: 'Update' })).not.toBeInTheDocument();
            expect(queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
        });
    });

    test('Patient Details can be updated and displays updates on success', async () => {
        const mockDetailsResponse ={
            data: { patient }
        }

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole, getByTestId } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', { id: patient.id } );

        await waitFor(() => {
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByText(patient.first_name)).toBeInTheDocument();
            expect(getByText('Middle Name:')).toBeInTheDocument();
            expect(getByText('N/A')).toBeInTheDocument();
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByText(patient.last_name)).toBeInTheDocument();
            expect(getByText('Date of Birth:')).toBeInTheDocument();
            expect(getByText(patient.date_of_birth)).toBeInTheDocument();
            expect(getByText('Phone:')).toBeInTheDocument();
            expect(getByText(patient.phone_number)).toBeInTheDocument();
            expect(getByText('Address:')).toBeInTheDocument();
            expect(getByText(patient.address)).toBeInTheDocument();
            expect(getByText('City:')).toBeInTheDocument();
            expect(getByText(patient.city)).toBeInTheDocument();
            expect(getByText('State:')).toBeInTheDocument();
            expect(getByText(patient.state)).toBeInTheDocument();
            expect(getByText('Zip Code:')).toBeInTheDocument();
            expect(getByText(patient.zip_code)).toBeInTheDocument();
            expect(getByText('Insurance Provider:')).toBeInTheDocument();
            expect(getByText(patient.insurance_provider)).toBeInTheDocument();
            expect(getByText('Policy Number:')).toBeInTheDocument();
            expect(getByText(patient.policy_number)).toBeInTheDocument();
            expect(getByText('SSN:')).toBeInTheDocument();
            expect(getByText(patient.ssn)).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Edit' }));
        });

        await waitFor(() => {
            expect(getByTestId('first_name').value).toBe(patient.first_name);
            expect(getByTestId('middle_name').value).toBe(patient.middle_name);
            expect(getByTestId('last_name').value).toBe(patient.last_name);
            expect(getByTestId('date_of_birth').value).toBe(patient.date_of_birth);
            expect(getByTestId('phone_number').value).toBe(patient.phone_number);
            expect(getByTestId('address').value).toBe(patient.address);
            expect(getByTestId('city').value).toBe(patient.city);
            expect(getByTestId('state').value).toBe(patient.state);
            expect(getByTestId('zip_code').value).toBe(patient.zip_code);
            expect(getByTestId('insurance_provider').value).toBe(patient.insurance_provider);
            expect(getByTestId('policy_number').value).toBe(patient.policy_number);
            expect(getByTestId('ssn').value).toBe(patient.ssn);
        });

        act(() => {
            fireEvent.change(getByTestId('first_name'), { target: { value: updatedPatient.first_name } });
            fireEvent.change(getByTestId('middle_name'), { target: { value: updatedPatient.middle_name } });
            fireEvent.change(getByTestId('last_name'), { target: { value: updatedPatient.last_name } });
            fireEvent.change(getByTestId('date_of_birth'), { target: { value: updatedPatient.date_of_birth } });
            fireEvent.change(getByTestId('phone_number'), { target: { value: updatedPatient.phone_number } });
            fireEvent.change(getByTestId('address'), { target: { value: updatedPatient.address } });
            fireEvent.change(getByTestId('city'), { target: { value: updatedPatient.city } });
            fireEvent.change(getByTestId('state'), { target: { value: updatedPatient.state } });
            fireEvent.change(getByTestId('zip_code'), { target: { value: updatedPatient.zip_code } });
            fireEvent.change(getByTestId('insurance_provider'), { target: { value: updatedPatient.insurance_provider } });
            fireEvent.change(getByTestId('policy_number'), { target: { value: updatedPatient.policy_number } });
            fireEvent.change(getByTestId('ssn'), { target: { value: updatedPatient.ssn } });

            expect(getByTestId('first_name').value).toBe(updatedPatient.first_name);
            expect(getByTestId('middle_name').value).toBe(updatedPatient.middle_name);
            expect(getByTestId('last_name').value).toBe(updatedPatient.last_name);
            expect(getByTestId('date_of_birth').value).toBe(updatedPatient.date_of_birth);
            expect(getByTestId('phone_number').value).toBe(updatedPatient.phone_number);
            expect(getByTestId('address').value).toBe(updatedPatient.address);
            expect(getByTestId('city').value).toBe(updatedPatient.city);
            expect(getByTestId('state').value).toBe(updatedPatient.state);
            expect(getByTestId('zip_code').value).toBe(updatedPatient.zip_code);
            expect(getByTestId('insurance_provider').value).toBe(updatedPatient.insurance_provider);
            expect(getByTestId('policy_number').value).toBe(updatedPatient.policy_number);
            expect(getByTestId('ssn').value).toBe(updatedPatient.ssn);

            fireEvent.click(getByRole('button', { name: 'Update' }));
            expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/update-patient/'+patient.id, updatedPatient);
        });

        await waitFor(() => {
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByText(updatedPatient.first_name)).toBeInTheDocument();
            expect(getByText('Middle Name:')).toBeInTheDocument();
            expect(getByText(updatedPatient.middle_name)).toBeInTheDocument();
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByText(updatedPatient.last_name)).toBeInTheDocument();
            expect(getByText('Date of Birth:')).toBeInTheDocument();
            expect(getByText(updatedPatient.date_of_birth)).toBeInTheDocument();
            expect(getByText('Phone:')).toBeInTheDocument();
            expect(getByText(updatedPatient.phone_number)).toBeInTheDocument();
            expect(getByText('Address:')).toBeInTheDocument();
            expect(getByText(updatedPatient.address)).toBeInTheDocument();
            expect(getByText('City:')).toBeInTheDocument();
            expect(getByText(updatedPatient.city)).toBeInTheDocument();
            expect(getByText('State:')).toBeInTheDocument();
            expect(getByText(updatedPatient.state)).toBeInTheDocument();
            expect(getByText('Zip Code:')).toBeInTheDocument();
            expect(getByText(updatedPatient.zip_code)).toBeInTheDocument();
            expect(getByText('Insurance Provider:')).toBeInTheDocument();
            expect(getByText(updatedPatient.insurance_provider)).toBeInTheDocument();
            expect(getByText('Policy Number:')).toBeInTheDocument();
            expect(getByText(updatedPatient.policy_number)).toBeInTheDocument();
            expect(getByText('SSN:')).toBeInTheDocument();
            expect(getByText(updatedPatient.ssn)).toBeInTheDocument();
        });
    });

    test('Error message displays when patient is not fetched', () => {
        const mockDetailsResponse ={
            "response": {
                "status": 500,
                "data": {
                    "error": "An error occurred while fetching patient details."
                }
            }
        }

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', { id: patient.id } );
        expect(getByText("There was an error loading patient details")).toBeInTheDocument();

    });

    test('Cancel button closes Edit form', async () => {
        const mockDetailsResponse ={
            data: { patient }
        }

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByRole, getByTestId } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/patient-details', { id: patient.id } );

        await waitFor(() => {
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByText(patient.first_name)).toBeInTheDocument();
            expect(getByText('Middle Name:')).toBeInTheDocument();
            expect(getByText('N/A')).toBeInTheDocument();
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByText(patient.last_name)).toBeInTheDocument();
            expect(getByText('Date of Birth:')).toBeInTheDocument();
            expect(getByText(patient.date_of_birth)).toBeInTheDocument();
            expect(getByText('Phone:')).toBeInTheDocument();
            expect(getByText(patient.phone_number)).toBeInTheDocument();
            expect(getByText('Address:')).toBeInTheDocument();
            expect(getByText(patient.address)).toBeInTheDocument();
            expect(getByText('City:')).toBeInTheDocument();
            expect(getByText(patient.city)).toBeInTheDocument();
            expect(getByText('State:')).toBeInTheDocument();
            expect(getByText(patient.state)).toBeInTheDocument();
            expect(getByText('Zip Code:')).toBeInTheDocument();
            expect(getByText(patient.zip_code)).toBeInTheDocument();
            expect(getByText('Insurance Provider:')).toBeInTheDocument();
            expect(getByText(patient.insurance_provider)).toBeInTheDocument();
            expect(getByText('Policy Number:')).toBeInTheDocument();
            expect(getByText(patient.policy_number)).toBeInTheDocument();
            expect(getByText('SSN:')).toBeInTheDocument();
            expect(getByText(patient.ssn)).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Edit' }));
        });

        await waitFor(() => {
            expect(getByTestId('first_name').value).toBe(patient.first_name);
            expect(getByTestId('middle_name').value).toBe(patient.middle_name);
            expect(getByTestId('last_name').value).toBe(patient.last_name);
            expect(getByTestId('date_of_birth').value).toBe(patient.date_of_birth);
            expect(getByTestId('phone_number').value).toBe(patient.phone_number);
            expect(getByTestId('address').value).toBe(patient.address);
            expect(getByTestId('city').value).toBe(patient.city);
            expect(getByTestId('state').value).toBe(patient.state);
            expect(getByTestId('zip_code').value).toBe(patient.zip_code);
            expect(getByTestId('insurance_provider').value).toBe(patient.insurance_provider);
            expect(getByTestId('policy_number').value).toBe(patient.policy_number);
            expect(getByTestId('ssn').value).toBe(patient.ssn);
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Cancel' }));
            expect(axios.put).not.toHaveBeenCalledWith('http://localhost:5000/update-patient/'+patient.id, updatedPatient);
        });

        await waitFor(() => {
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByText(patient.first_name)).toBeInTheDocument();
            expect(getByText('Middle Name:')).toBeInTheDocument();
            expect(getByText('N/A')).toBeInTheDocument();
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByText(patient.last_name)).toBeInTheDocument();
            expect(getByText('Date of Birth:')).toBeInTheDocument();
            expect(getByText(patient.date_of_birth)).toBeInTheDocument();
            expect(getByText('Phone:')).toBeInTheDocument();
            expect(getByText(patient.phone_number)).toBeInTheDocument();
            expect(getByText('Address:')).toBeInTheDocument();
            expect(getByText(patient.address)).toBeInTheDocument();
            expect(getByText('City:')).toBeInTheDocument();
            expect(getByText(patient.city)).toBeInTheDocument();
            expect(getByText('State:')).toBeInTheDocument();
            expect(getByText(patient.state)).toBeInTheDocument();
            expect(getByText('Zip Code:')).toBeInTheDocument();
            expect(getByText(patient.zip_code)).toBeInTheDocument();
            expect(getByText('Insurance Provider:')).toBeInTheDocument();
            expect(getByText(patient.insurance_provider)).toBeInTheDocument();
            expect(getByText('Policy Number:')).toBeInTheDocument();
            expect(getByText(patient.policy_number)).toBeInTheDocument();
            expect(getByText('SSN:')).toBeInTheDocument();
            expect(getByText(patient.ssn)).toBeInTheDocument();
        });
    });
});