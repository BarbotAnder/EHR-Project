import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientEmergencyContactsForm from '../patient/PatientEmergencyContactsForm';

// test('', () => {});

jest.mock('axios');

const patient = {
    id: 1,
};

const addEmergencyContacts = {
    patient_id: patient.id,
    rel: 'mother', 
    name: 'mom', 
    phone: '208-222-2222',
};

const routes = (<BrowserRouter><PatientEmergencyContactsForm patientId={patient.id}/></BrowserRouter>);

describe('Patient Patient Emergency Contacts', () => {
    test('Patient Patient Emergency Contacts renders', async () => {
        const mockPatientEmergencyContactsResponse = {
            data: {
                ec: []
            }
        }

        axios.post.mockResolvedValue(mockPatientEmergencyContactsResponse);

        const { getByText } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Emergency Contacts')).toBeInTheDocument();
            expect(getByText('No emergency contacts available for this patient.')).toBeInTheDocument();
        });
    });

    test('Empty form causes pop-up message', async () => {
        const mockPatientEmergencyContactsResponse = {
            data: {
                ec: []
            }
        }

        axios.post.mockResolvedValue(mockPatientEmergencyContactsResponse);

        const { getByText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Emergency Contacts')).toBeInTheDocument();
            expect(getByText('No emergency contacts available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Add Patient Emergency Contact send' }));
        });

        expect(getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    test('Patient Patient Emergency Contacts can be added', async () => {
        const mockPatientEmergencyContactsResponse = {
            data: {
                ec: []
            }
        }

        axios.post.mockResolvedValue(mockPatientEmergencyContactsResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await waitFor(() => {
            expect(getByText('Existing Emergency Contacts')).toBeInTheDocument();
            expect(getByText('No emergency contacts available for this patient.')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(getByLabelText(/Emergency Contact Relationship/), { target: { value: addEmergencyContacts.rel } });
            fireEvent.change(getByLabelText(/Emergency Contact Name/), { target: { value: addEmergencyContacts.name } });
            fireEvent.change(getByLabelText('Phone Number (000-000-0000)'), { target: { value: addEmergencyContacts.phone } });
            fireEvent.click(getByRole('button', { name: 'Add Patient Emergency Contact send' }));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-patient-emergency-contacts', addEmergencyContacts);
    });
});
