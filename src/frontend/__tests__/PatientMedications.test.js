import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientMedicationsForm from '../patient/PatientMedicationsForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addMedications = {
    patient_id: patient.id,
    medication: 'Tylenol',
    dosage: '250mg',
    frequency: '1',
};

const routes = (<BrowserRouter><PatientMedicationsForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Medications', () => {
    test('Patient Medications renders', async () => {
        const mockPatientMedicationsResponse = {
            data: {
                m: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicationsResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medications')).toBeInTheDocument();
            expect(getByText('No medications available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientMedicationsResponse = {
            data: {
                m: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicationsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medications')).toBeInTheDocument();
            expect(getByText('No medications available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Medication send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Medications can be added', async () => {
        const mockPatientMedicationsResponse = {
            data: {
                m: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicationsResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medications')).toBeInTheDocument();
            expect(getByText('No medications available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Medication/), { target: { value: addMedications.medication } });
            fireEvent.change(getByLabelText(/Dosage/), { target: { value: addMedications.dosage } });
            fireEvent.change(getByLabelText(/Frequency/), { target: { value: addMedications.frequency } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Medication send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-medications', addMedications);
    });
});
