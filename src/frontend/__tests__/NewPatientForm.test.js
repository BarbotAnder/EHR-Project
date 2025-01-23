import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewPatientForm from '../patient/NewPatientForm';

// test('', () => {});

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
const onFormClose = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock("react-select", () => ({ options, value, onChange }) => {
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

beforeEach(() => {
    mockedUsedNavigate.mockReset();
});

const routes = (<BrowserRouter><NewPatientForm onFormClose={onFormClose}/></BrowserRouter>);

describe('', () => {
    test('New Patient Form renders', () => {
        const { getByText } = render(routes);
        expect(getByText("New Patient Form")).toBeInTheDocument();
    });
    
    test('Empty form causes pop-up message', () => {
        const { getByText, getByRole } = render(routes);

        fireEvent.click(getByRole('button', { name: 'Add New Patient send' }));
        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Duplicate email causes pop-up message on valid form submit', async () => {
        const patient = {
            firstname: 'patient',
            middlename: '',
            lastname: 'test',
            dob: '2001-11-11',
            address: '1910 W University Dr',
            city: 'Boise',
            state: 'ID',
            zip_code: '83725',
            phone_number: '208-777-7777',
            email: 'patient@test.com',
            ssn: '519-65-1111',
        }

        const mockResponse = {
            "response": {
                "status": 304,
                "data": {
                    "error": "Email is already associated with a patient."
                }
            }
        }

        const { getByText, getByLabelText, getByRole, getByTestId } = render(routes);

        let select = getByTestId("select");
        axios.post.mockRejectedValue(mockResponse);
        
        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: patient.firstname } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: patient.lastname } });
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: patient.dob } });
            fireEvent.change(getByLabelText(/Address/), { target: { value: patient.address } });
            fireEvent.change(getByLabelText(/City/), { target: { value: patient.city } });
            fireEvent.change(select, { target: { value: patient.state } });
            fireEvent.change(getByLabelText(/Zip Code/), { target: { value: patient.zip_code } });
            fireEvent.change(getByLabelText('Phone Number (000-000-0000)'), { target: { value: patient.phone_number } });
            fireEvent.change(getByLabelText(/Email/), { target: { value: patient.email } });
            fireEvent.change(getByLabelText('SSN (000-00-0000)'), { target: { value: patient.ssn } });

            expect(getByLabelText(/First Name/).value).toBe(patient.firstname);
            expect(getByLabelText(/Middle Name/).value).toBe('');
            expect(getByLabelText(/Last Name/).value).toBe(patient.lastname);
            expect(getByLabelText(/Date of Birth/).value).toBe(patient.dob);
            expect(getByLabelText(/Address/).value).toBe(patient.address);
            expect(getByLabelText(/City/).value).toBe(patient.city);
            expect(select).toHaveValue("ID");
            expect(getByLabelText(/Zip Code/).value).toBe(patient.zip_code);
            expect(getByLabelText('Phone Number (000-000-0000)').value).toBe(patient.phone_number);
            expect(getByLabelText(/Email/).value).toBe(patient.email);
            expect(getByLabelText('SSN (000-00-0000)').value).toBe(patient.ssn);

            fireEvent.click(getByRole('button', { name: 'Add New Patient send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient', 
                                                patient,
                                                {"withCredentials": true}
        );
        expect(getByText(mockResponse.response.data.error)).toBeInTheDocument();
    });

    test('Duplicate SSN causes pop-up message on valid form submit', async () => {
        const patient = {
            firstname: 'patient',
            middlename: '',
            lastname: 'test',
            dob: '2001-11-11',
            address: '1910 W University Dr',
            city: 'Boise',
            state: 'ID',
            zip_code: '83725',
            phone_number: '208-777-7777',
            email: 'patient@test.com',
            ssn: '519-65-1111',
        }

        const mockResponse = {
            "response": {
                "status": 305,
                "data": {
                    "error": "SSN is already associated with a patient."
                }
            }
        }

        const { getByText, getByLabelText, getByRole, getByTestId } = render(routes);

        let select = getByTestId("select");
        axios.post.mockRejectedValue(mockResponse);
        
        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: patient.firstname } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: patient.lastname } });
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: patient.dob } });
            fireEvent.change(getByLabelText(/Address/), { target: { value: patient.address } });
            fireEvent.change(getByLabelText(/City/), { target: { value: patient.city } });
            fireEvent.change(select, { target: { value: patient.state } });
            fireEvent.change(getByLabelText(/Zip Code/), { target: { value: patient.zip_code } });
            fireEvent.change(getByLabelText('Phone Number (000-000-0000)'), { target: { value: patient.phone_number } });
            fireEvent.change(getByLabelText(/Email/), { target: { value: patient.email } });
            fireEvent.change(getByLabelText('SSN (000-00-0000)'), { target: { value: patient.ssn } });

            expect(getByLabelText(/First Name/).value).toBe(patient.firstname);
            expect(getByLabelText(/Middle Name/).value).toBe('');
            expect(getByLabelText(/Last Name/).value).toBe(patient.lastname);
            expect(getByLabelText(/Date of Birth/).value).toBe(patient.dob);
            expect(getByLabelText(/Address/).value).toBe(patient.address);
            expect(getByLabelText(/City/).value).toBe(patient.city);
            expect(select).toHaveValue("ID");
            expect(getByLabelText(/Zip Code/).value).toBe(patient.zip_code);
            expect(getByLabelText('Phone Number (000-000-0000)').value).toBe(patient.phone_number);
            expect(getByLabelText(/Email/).value).toBe(patient.email);
            expect(getByLabelText('SSN (000-00-0000)').value).toBe(patient.ssn);

            fireEvent.click(getByRole('button', { name: 'Add New Patient send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient', 
                                                patient,
                                                {"withCredentials": true}
        );
        expect(getByText(mockResponse.response.data.error)).toBeInTheDocument();
    });

    test('Valid form submit redirects to dashboard', async () => {
        const patient = {
            firstname: 'patient',
            middlename: '',
            lastname: 'test',
            dob: '2001-11-11',
            address: '1910 W University Dr',
            city: 'Boise',
            state: 'ID',
            zip_code: '83725',
            phone_number: '208-777-7777',
            email: 'patient@test.com',
            ssn: '519-65-1111',
        }

        const { getByLabelText, getByRole, getByTestId } = render(routes);
        let select = getByTestId("select");
        
        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: patient.firstname } });
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: patient.lastname } });
            fireEvent.change(getByLabelText(/Date of Birth/), { target: { value: patient.dob } });
            fireEvent.change(getByLabelText(/Address/), { target: { value: patient.address } });
            fireEvent.change(getByLabelText(/City/), { target: { value: patient.city } });
            fireEvent.change(select, { target: { value: patient.state } });
            fireEvent.change(getByLabelText(/Zip Code/), { target: { value: patient.zip_code } });
            fireEvent.change(getByLabelText('Phone Number (000-000-0000)'), { target: { value: patient.phone_number } });
            fireEvent.change(getByLabelText(/Email/), { target: { value: patient.email } });
            fireEvent.change(getByLabelText('SSN (000-00-0000)'), { target: { value: patient.ssn } });

            expect(getByLabelText(/First Name/).value).toBe(patient.firstname);
            expect(getByLabelText(/Middle Name/).value).toBe('');
            expect(getByLabelText(/Last Name/).value).toBe(patient.lastname);
            expect(getByLabelText(/Date of Birth/).value).toBe(patient.dob);
            expect(getByLabelText(/Address/).value).toBe(patient.address);
            expect(getByLabelText(/City/).value).toBe(patient.city);
            expect(select).toHaveValue("ID");
            expect(getByLabelText(/Zip Code/).value).toBe(patient.zip_code);
            expect(getByLabelText('Phone Number (000-000-0000)').value).toBe(patient.phone_number);
            expect(getByLabelText(/Email/).value).toBe(patient.email);
            expect(getByLabelText('SSN (000-00-0000)').value).toBe(patient.ssn);

            fireEvent.click(getByRole('button', { name: 'Add New Patient send' }));
        });
        expect(onFormClose).toHaveBeenCalledTimes(1);
    });
});