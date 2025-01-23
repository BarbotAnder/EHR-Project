import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientAllergiesForm from '../patient/PatientAllergiesForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addAllergy = {
    patient_id: patient.id,
    allergy: 'peanuts'
};

const routes = (<BrowserRouter><PatientAllergiesForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Allergies', () => {
    test('Patient Allergies renders', async () => {
        const mockAllergiesResponse = {
            data: {
                a: []
            }
        }

        axios.post.mockResolvedValue(mockAllergiesResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText("Existing Allergies")).toBeInTheDocument();
            expect(getByText("No allergies available for this patient.")).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockAllergiesResponse = {
            data: {
                a: []
            }
        }

        axios.post.mockResolvedValue(mockAllergiesResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Existing Allergies")).toBeInTheDocument();
            expect(getByText("No allergies available for this patient.")).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Allergy send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Allergies can be added', async () => {
        const mockAllergiesResponse = {
            data: {
                a: []
            }
        }

        axios.post.mockResolvedValue(mockAllergiesResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText("Existing Allergies")).toBeInTheDocument();
            expect(getByText("No allergies available for this patient.")).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Enter an allergy.../), { target: { value: addAllergy.allergy } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Allergy send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-allergy', addAllergy);
    });
});
