import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Reports from '../pages/Reports';
import Sidebar from '../components/Sidebar';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><Reports /></BrowserRouter>);

describe('Reports', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/reports');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /reports', () => {
        const { getByText } = render(routes);
        expect(window.location.pathname).toBe('/reports');
        expect(getByText('Reports Dashboard')).toBeInTheDocument();
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(<BrowserRouter><Sidebar /></BrowserRouter>);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/reports');
    });
});