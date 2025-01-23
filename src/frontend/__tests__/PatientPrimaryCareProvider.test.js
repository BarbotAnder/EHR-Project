import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientPrimaryCareProviderForm from '../patient/PatientPrimaryCareProviderForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addPrimaryCareProvider = {
    patient_id: patient.id,
    name: 'practitioner test', 
    phone: '208-888-8888',
};

const routes = (<BrowserRouter><PatientPrimaryCareProviderForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Primary Care Provider', () => {
    test('Patient Primary Care Provider renders', async () => {
        const mockPatientPrimaryCareProviderResponse = {
            data: {
                pcp: []
            }
        }

        axios.post.mockResolvedValue(mockPatientPrimaryCareProviderResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Primary Care Providers')).toBeInTheDocument();
            expect(getByText('No primary care providers available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientPrimaryCareProviderResponse = {
            data: {
                pcp: []
            }
        }

        axios.post.mockResolvedValue(mockPatientPrimaryCareProviderResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Primary Care Providers')).toBeInTheDocument();
            expect(getByText('No primary care providers available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Primary Care Provider send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Primary Care Provider can be added', async () => {
        const mockPatientPrimaryCareProviderResponse = {
            data: {
                pcp: []
            }
        }

        axios.post.mockResolvedValue(mockPatientPrimaryCareProviderResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Primary Care Providers')).toBeInTheDocument();
            expect(getByText('No primary care providers available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Primary Care Provider Name/), { target: { value: addPrimaryCareProvider.name } });
            fireEvent.change(getByLabelText('Phone Number (000-000-0000)'), { target: { value: addPrimaryCareProvider.phone } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Primary Care Provider send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-primary-care-providers', addPrimaryCareProvider);
    });
});
