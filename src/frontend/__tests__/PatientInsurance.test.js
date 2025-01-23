import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientInsuranceForm from '../patient/PatientInsuranceForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addInsurance = {
    patient_id: patient.id,
    insurance_provider: 'Blue Cross',
    policy_number: 'ABC123  ',
    group_number: 'GN456',
    policy_holders_name: 'patient test',
};

const routes = (<BrowserRouter><PatientInsuranceForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Insurance', () => {
    test('Patient Insurance renders', async () => {
        const mockPatientInsuranceResponse = {
            data: {
                insurance: []
            }
        }

        axios.post.mockResolvedValue(mockPatientInsuranceResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Insurance')).toBeInTheDocument();
            expect(getByText('No insurance available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientInsuranceResponse = {
            data: {
                insurance: []
            }
        }

        axios.post.mockResolvedValue(mockPatientInsuranceResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Insurance')).toBeInTheDocument();
            expect(getByText('No insurance available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Insurance send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Insurance can be added', async () => {
        const mockPatientInsuranceResponse = {
            data: {
                insurance: []
            }
        }

        axios.post.mockResolvedValue(mockPatientInsuranceResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Insurance')).toBeInTheDocument();
            expect(getByText('No insurance available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Insurance Provider/), { target: { value: addInsurance.insurance_provider } });
            fireEvent.change(getByLabelText(/Policy Number/), { target: { value: addInsurance.policy_number } });
            fireEvent.change(getByLabelText(/Group Number/), { target: { value: addInsurance.group_number } });
            fireEvent.change(getByLabelText(/Policy Holder's Name/), { target: { value: addInsurance.policy_holders_name } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Insurance send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-insurance', addInsurance);
    });
});
