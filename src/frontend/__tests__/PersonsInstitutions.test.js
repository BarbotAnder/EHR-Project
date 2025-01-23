import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';
import PersonsInstitutions from '../pages/PersonsInstitutions';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><PersonsInstitutions /></BrowserRouter>);

describe('Persons & Institutions Dashboard', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/persons-institutions');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /persons-institutions', () => {
        const { getByText } = render(routes);
        expect(window.location.pathname).toBe('/persons-institutions');
        expect(getByText('Persons & Institutions Dashboard')).toBeInTheDocument();
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(<BrowserRouter><Sidebar /></BrowserRouter>);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/persons-institutions');
    });
});