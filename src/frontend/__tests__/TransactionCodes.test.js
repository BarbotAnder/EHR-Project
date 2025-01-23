import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TransactionCodes from '../pages/TransactionCodes';
import Sidebar from '../components/Sidebar';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><TransactionCodes /></BrowserRouter>);

describe('Transaction Codes', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/transaction-codes');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /transaction-codes', () => {
        const { getByText } = render(routes);
        expect(window.location.pathname).toBe('/transaction-codes');
        expect(getByText('Transaction Codes Dashboard')).toBeInTheDocument();
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(<BrowserRouter><Sidebar /></BrowserRouter>);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/transaction-codes');
    });
});