import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientNotes from '../patient/patientNotes';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addnote = {
    patientId: patient.id,
    note: 'test note',
    practitionerId: 1
};

const routes = (<BrowserRouter><PatientNotes patientId={patient.id}/></BrowserRouter>);

describe('Patient Notes', () => {
    test('Patient Notes renders', async () => {
        const mockPatientMedicalHistoryResponse = {
            data: {
                notes: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Notes')).toBeInTheDocument();
            expect(getByText('No notes available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientMedicalHistoryResponse = {
            data: {
                notes: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Notes')).toBeInTheDocument();
            expect(getByText('No notes available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Note add' }));
        });

        expect(getByText('Please enter a note.')).toBeInTheDocument();
    });

    test('Patient Notes can be added', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'user_id=1',
        });

        const mockPatientMedicalHistoryResponse = {
            data: {
                notes: []
            }
        }

        axios.post.mockResolvedValue(mockPatientMedicalHistoryResponse);

        const { getByText, getByTestId, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Notes')).toBeInTheDocument();
            expect(getByText('No notes available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByTestId('patient-note'), { target: { value: addnote.note } });
            fireEvent.click(getByRole('button', { name: 'Add Note add' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/save-note', addnote);
    });
});
