import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// test('', () => {});

jest.mock('axios');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
    mockedUsedNavigate.mockReset();
});

const routes = (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />}/>
        </Routes>
    </BrowserRouter>
);

describe('Signup page', () => {

    test('Direct to Signup page from Login page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText('Sign Up'));
        expect(location.pathname).toBe('/signup');
    });

    test('Empty signup form causes pop-up message', () => {
        const { getByText, getByRole } = render(routes);

        fireEvent.click(getByRole('button'));
        expect(getByText('Please fill out required fields.')).toBeInTheDocument();
    });

    test('Duplicate email causes pop-up message on valid form submit', async () => {
        const user = { account_type: 'patient', firstName: 'test', lastName: 'test', email: 'test@test.com', password: 'test', repeatPassword: 'test' };
        const mockResponse = {
            response: {
                status: 305,
                data: {
                    error: 'Email is already associated with an account.'
                }
            }
        }

        const { getByText, getByLabelText, getByRole } = render(routes);

        axios.post.mockRejectedValue(mockResponse);

        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: user.firstName } } );
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: user.lastName } } );
            fireEvent.change(getByLabelText(/Email/), { target: { value: user.email } } );
            fireEvent.change(getByLabelText('Password', { exact: true }), { target: { value: user.password } } );
            fireEvent.change(getByLabelText('Repeat Password', { exact: true }), { target: { value: user.repeatPassword } } );

            expect(getByLabelText(/First Name/).value).toBe(user.firstName);
            expect(getByLabelText(/Last Name/).value).toBe(user.lastName);
            expect(getByLabelText(/Email/).value).toBe(user.email);
            expect(getByLabelText('Password', { exact: true }).value).toBe(user.password);
            expect(getByLabelText('Repeat Password', { exact: true }).value).toBe(user.repeatPassword);

            // more stuff about security questions...
            


            fireEvent.click(getByRole('button'));
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/add-user', user);
        await waitFor(() => {
            expect(getByText('Email is already associated with an account.')).toBeInTheDocument();
        });
    });

    test('Error message displays on signup form when any error occurs', async () => {
        const user = { account_type: 'patient', firstName: 'test', lastName: 'test', email: 'test@test.com', password: 'test', repeatPassword: 'test' };
        const mockResponse = {
            response: {
                status: 500,
                data: {
                    error: 'There was an error adding the user.'
                }
            }
        }
        
        axios.post.mockRejectedValue(mockResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: user.firstName } } );
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: user.lastName } } );
            fireEvent.change(getByLabelText(/Email/), { target: { value: user.email } } );
            fireEvent.change(getByLabelText('Password', { exact: true }), { target: { value: user.password } } );
            fireEvent.change(getByLabelText('Repeat Password', { exact: true }), { target: { value: user.repeatPassword } } );

            expect(getByLabelText(/First Name/).value).toBe(user.firstName);
            expect(getByLabelText(/Last Name/).value).toBe(user.lastName);
            expect(getByLabelText(/Email/).value).toBe(user.email);
            expect(getByLabelText('Password', { exact: true }).value).toBe(user.password);
            expect(getByLabelText('Repeat Password', { exact: true }).value).toBe(user.repeatPassword);

            // more stuff about security questions...
            


            fireEvent.click(getByRole('button'));
        });

        await waitFor(() => {
            expect(getByText('There was an error adding the user.')).toBeInTheDocument();
        });
    });
    
    test('Valid signup form causes redirection to Login page', async () => {
        const user = { account_type: 'patient', firstName: 'test', lastName: 'test', email: 'test@test.com', password: 'test', repeatPassword: 'test' };

        const { getByLabelText, getByRole } = render(routes);

        await act(async () => {
            fireEvent.change(getByLabelText(/First Name/), { target: { value: user.firstName } } );
            fireEvent.change(getByLabelText(/Last Name/), { target: { value: user.lastName } } );
            fireEvent.change(getByLabelText(/Email/), { target: { value: user.email } } );
            fireEvent.change(getByLabelText('Password', { exact: true }), { target: { value: user.password } } );
            fireEvent.change(getByLabelText('Repeat Password', { exact: true }), { target: { value: user.repeatPassword } } );

            expect(getByLabelText(/First Name/).value).toBe(user.firstName);
            expect(getByLabelText(/Last Name/).value).toBe(user.lastName);
            expect(getByLabelText(/Email/).value).toBe(user.email);
            expect(getByLabelText('Password', { exact: true }).value).toBe(user.password);
            expect(getByLabelText('Repeat Password', { exact: true }).value).toBe(user.repeatPassword);

            // more stuff about security questions...
            
            

            fireEvent.click(getByRole('button'));
        });
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

    test('"Back to Login" redirects to Login page from Sign up page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText(/Back to Login/));
        expect(location.pathname).toBe('/');
    });
});