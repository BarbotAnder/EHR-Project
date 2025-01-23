import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserManagement from '../user/UserManagement';
import Sidebar from '../components/Sidebar';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><UserManagement /></BrowserRouter>);

describe('User Management', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/user-management');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /user-management', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });

        const { getByText } = render(routes);
        expect(window.location.pathname).toBe('/user-management');
        expect(getByText('Users:')).toBeInTheDocument();
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(<BrowserRouter><Sidebar /></BrowserRouter>);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/user-management');
    });

    test('List of users is not rendered given account_type is not set', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: '',
        });
        
        const { getByText, queryByText } = render(routes);
        expect(queryByText('Users:')).not.toBeInTheDocument();

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/get-all-users');
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('List of users is not rendered given account_type=practitioner', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });

        const { getByText, queryByText } = render(routes);
        expect(queryByText('Users:')).not.toBeInTheDocument();

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/get-all-users');
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('List of users is not rendered given account_type=office', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });

        const { getByText, queryByText } = render(routes);
        expect(queryByText('Users:')).not.toBeInTheDocument();

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/get-all-users');
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('List of users is not rendered given account_type=patient', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { getByText, queryByText } = render(routes);
        expect(queryByText('Users:')).not.toBeInTheDocument();

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/get-all-users');
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('List of users is not rendered given account_type=inactive', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=inactive',
        });

        const { getByText, queryByText } = render(routes);
        expect(queryByText('Users:')).not.toBeInTheDocument();

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/get-all-users');
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('List of users is rendered given account_type=admin', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });

        const mockResponse = {
            data: {
                users: [
                    {
                        id: 1,
                        account_type: 'admin',
                        first_name: 'admin',
                        last_name: 'test1',
                        email: 'admin@test.com'
                    },
                    {
                        id: 2,
                        account_type: 'practitioner',
                        first_name: 'practitioner',
                        last_name: 'test2',
                        email: 'practitioner@test.com'
                    },
                    {
                        id: 3,
                        account_type: 'office',
                        first_name: 'office',
                        last_name: 'test3',
                        email: 'office@test.com'
                    },
                    {
                        id: 4,
                        account_type: 'patient',
                        first_name: 'patient',
                        last_name: 'test4',
                        email: 'patient@test.com'
                    },
                    {
                        id: 5,
                        account_type: 'inactive',
                        first_name: 'inactive',
                        last_name: 'test5',
                        email: 'inactive@test.com'
                    }
                ]
            }
        }

        axios.post.mockResolvedValue(mockResponse);

        const { getByText } = render(routes);
        expect(getByText('Users:')).toBeInTheDocument();
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/get-all-users');

        await waitFor(() => {
            for (let i=0; i<mockResponse.data.users.length; i++) {
                const user = mockResponse.data.users[i];
                expect(getByText('Account Type: '+user.account_type)).toBeInTheDocument();
                expect(getByText('First Name: '+user.first_name)).toBeInTheDocument();
                expect(getByText('Last Name: '+user.last_name)).toBeInTheDocument();
                expect(getByText('Email: '+user.email)).toBeInTheDocument(); 
            }
        })
    });
});