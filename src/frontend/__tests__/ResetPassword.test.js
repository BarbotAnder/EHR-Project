import { act, fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

describe('Reset Password', () => {
    test('Directs to Reset Password page from Login', () => {
        render(routes);

        fireEvent.click(screen.getByText('Forgot Password?'));
        expect(location.pathname).toBe('/reset-password');
    });
    
    // tests about security questions


    
});