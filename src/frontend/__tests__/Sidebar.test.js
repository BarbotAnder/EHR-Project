import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';

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

const routes = (<BrowserRouter><Sidebar /></BrowserRouter>);

describe('Sidebar', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/dashboard');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('window.location.reload is mocked', () => {
        expect(jest.isMockFunction(window.location.reload)).toBe(true);
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(routes);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/dashboard');
    });

    test('Logout button redirects to Login', async () => {
        const { getByText } = render(routes);

        await act(async () => {
            fireEvent.click(getByText('Log out'));
        });

        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

    test('Sidebar renders links (with User Management given account_type="admin")', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });

        const { getByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(getByText("User Management")).toBeInTheDocument();
        expect(getByText("Transaction Codes")).toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });

    test('Sidebar renders links (without User Management given account_type="practitioner")', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });

        const { getByText, queryByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(queryByText("User Management")).not.toBeInTheDocument();
        expect(getByText("Transaction Codes")).toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });

    test('Sidebar renders links (without User Management given account_type="office")', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });

        const { getByText, queryByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(queryByText("User Management")).not.toBeInTheDocument();
        expect(getByText("Transaction Codes")).toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });

    test('Sidebar renders links (without User Management & Transaction Codes given account_type="patient")', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { getByText, queryByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(queryByText("User Management")).not.toBeInTheDocument();
        expect(queryByText("Transaction Codes")).not.toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });

    test('Sidebar renders links (without User Management & Transaction Codes given account_type="inactive")', () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=inactive',
        });

        const { getByText, queryByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(queryByText("User Management")).not.toBeInTheDocument();
        expect(queryByText("Transaction Codes")).not.toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });

    test('Sidebar renders links (without User Management & Transaction Codes given no account_type)', () => {
        const { getByText, queryByText } = render(routes);

        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Billing")).toBeInTheDocument();
        expect(getByText("Documents")).toBeInTheDocument();
        expect(getByText("Persons & Institutions")).toBeInTheDocument();
        expect(getByText("Reports")).toBeInTheDocument();
        expect(getByText("Scheduler")).toBeInTheDocument();
        expect(getByText("System")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(queryByText("User Management")).not.toBeInTheDocument();
        expect(queryByText("Transaction Codes")).not.toBeInTheDocument();
        expect(getByText("Refresh")).toBeInTheDocument();
        expect(getByText("Log out")).toBeInTheDocument();
    });
});