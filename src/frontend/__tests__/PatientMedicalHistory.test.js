import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientMedicalHistoryForm from '../patient/PatientMedicalHistoryForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addMedicalHistory = {
    patient_id: patient.id,
    notes: 'test note',
};

const routes = (<BrowserRouter><PatientMedicalHistoryForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Medical History', () => {
    test('Patient Medical History renders', async () => {
        const mockPatientMedicalHistoryResponse = {
            data: {
                mh: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medical History')).toBeInTheDocument();
            expect(getByText('No medical history available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientMedicalHistoryResponse = {
            data: {
                mh: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medical History')).toBeInTheDocument();
            expect(getByText('No medical history available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Medical History send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Medical History can be added', async () => {
        const mockPatientMedicalHistoryResponse = {
            data: {
                mh: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Medical History')).toBeInTheDocument();
            expect(getByText('No medical history available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Enter Medical History.../), { target: { value: addMedicalHistory.notes } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Medical History send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-medical-history', addMedicalHistory);
    });
});
