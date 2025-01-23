import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ResetPassword from '../pages/ResetPassword';

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

const routes = (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />}/>
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    </BrowserRouter>
);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
    mockedUsedNavigate.mockReset();
});

describe('Login page', () => {
    test('Error message displays on empty login form submit', () => {
        const { getByText, getByRole } = render(routes);

        const button = getByRole('button');
        expect(button).toHaveTextContent('Login');

        fireEvent.click(button);
        expect(getByText('Please fill out required fields.')).toBeInTheDocument();
    });

    test('"Forgot Password?" link redirects to reset password page', () => {
        const { getByText } = render(routes);
        fireEvent.click(getByText('Forgot Password?'));

        expect(location.pathname).toBe('/reset-password');
    });

    test('"Back to Login" link redirects to Login page from reset password page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText(/Back to Login/));
        expect(location.pathname).toBe('/');
    });

    test('Sign up link redirects to Sign up page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText(/Sign Up/));
        expect(location.pathname).toBe('/signup');
    });

    test('"Back to Login" redirects to Login page from Sign up page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText(/Back to Login/));
        expect(location.pathname).toBe('/');
    });

    test('Error message displays on database error with form submit', async () => {
        const user = { un: 'test@test.com', pw: 'test' };
        
        const mockResponse = {
            response: {
                status: 500,
                data: {
                    message: 'An error occurred while logging in.'
                }
            }
        };

        axios.post.mockRejectedValue(mockResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await act(async() => {
            fireEvent.change(getByLabelText(/Username/), { target: { value: user.un } } );
            fireEvent.change(getByLabelText(/Password/), { target: { value: user.pw } } );
            expect(getByLabelText(/Username/).value).toBe(user.un);
            expect(getByLabelText(/Password/).value).toBe(user.pw);
            fireEvent.click(getByRole('button'));
        });

        await waitFor(() => {
            expect(getByText('An error occurred while logging in.')).toBeInTheDocument();
        });
    });

    test('Error message displays on invalid login form', async () => {
        const user = { un: 'test@test.com', pw: 'test' };
        
        const mockResponse = {
            response: {
                status: 404,
                data: {
                    message: 'Invalid username and/or password.'
                }
            }
        };

        axios.post.mockRejectedValue(mockResponse);

        const { getByText, getByLabelText, getByRole } = render(routes);

        await act(async() => {
            fireEvent.change(getByLabelText(/Username/), { target: { value: user.un } } );
            fireEvent.change(getByLabelText(/Password/), { target: { value: user.pw } } );
            expect(getByLabelText(/Username/).value).toBe(user.un);
            expect(getByLabelText(/Password/).value).toBe(user.pw);
            fireEvent.click(getByRole('button'));
        });

        await waitFor(() => {
            expect(getByText('Invalid username and/or password.')).toBeInTheDocument();
        });
    });

    test('Valid login form causes redirection to dashboard', async () => {
        const user = { un: 'admin@test.com', pw: 'admin' };

        const mockResponse = {
            response: {
                "data": {
                    "valid": {
                        id: 1, 
                        account_type: 'admin', 
                        first_name: 'admin', 
                        last_name: 'test', 
                        password: 'admin',
                        email: 'admin@test.com', 
                        profile_picture: null
                    }
                }
            }
        };

        axios.post.mockResolvedValue(mockResponse);

        const { getByLabelText, getByRole } = render(routes);

        await act(async() => {
            fireEvent.change(getByLabelText(/Username/), { target: { value: user.un } } );
            fireEvent.change(getByLabelText(/Password/), { target: { value: user.pw } } );
            expect(getByLabelText(/Username/).value).toBe(user.un);
            expect(getByLabelText(/Password/).value).toBe(user.pw);
            fireEvent.click(getByRole('button'));
        });

        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard?username=admin@test.com');
        });
    });
});