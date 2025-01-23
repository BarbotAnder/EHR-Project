import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Dashboard';

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

const routes = (<BrowserRouter><Dashboard /></BrowserRouter>);

describe('Dashboard', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/dashboard?test@test.com');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /dashboard', () => {
        render(routes);
        expect(window.location.pathname).toBe('/dashboard');
    });

    test('New Patient button displays New Patient form for account_type="admin"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('New Patient'));

        expect(getByText('New Patient Form')).toBeInTheDocument();
    });

    test('Search Patient button displays Search Patient form for account_type="admin"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('Search Patient'));

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('New Patient button displays New Patient form for account_type="practitioner"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('New Patient'));

        expect(getByText('New Patient Form')).toBeInTheDocument();
    });

    test('Search Patient button displays Search Patient form for account_type="practitioner"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('Search Patient'));

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('New Patient button displays New Patient form for account_type="office"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('New Patient'));

        expect(getByText('New Patient Form')).toBeInTheDocument();
    });

    test('Search Patient button displays Search Patient form for account_type="office"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });

        const { getByText } = render(routes);

        fireEvent.click(getByText('Search Patient'));

        expect(getByText('Search for a Patient by Date of Birth and Last Name')).toBeInTheDocument();
    });

    test('New Patient button does not display New Patient form for account_type="patient"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { queryByText } = render(routes);

        expect(queryByText('New Patient')).not.toBeInTheDocument();
    });

    test('Search Patient button does not display Search Patient form for account_type="patient"', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { queryByText } = render(routes);

        expect(queryByText('Search Patient')).not.toBeInTheDocument();
    });
});