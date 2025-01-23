import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Scheduler from '../pages/Scheduler';
import Sidebar from '../components/Sidebar';

// test('', () => {});

jest.mock('axios');

const routes = (<BrowserRouter><Scheduler /></BrowserRouter>);

describe('Scheduler', () => {
    const { location } = window;
  
    beforeAll(() => {
        const location = new URL('http://localhost/scheduler');
        location.reload = jest.fn();

        delete window.location;
        window.location = location;
    });
  
    afterAll(() => {
        window.location = location;
    });

    test('Window.location.pathname is /scheduler', () => {
        const { getByText } = render(routes);
        expect(window.location.pathname).toBe('/scheduler');
        expect(getByText('Scheduler')).toBeInTheDocument();
    });
  
    test('Refresh button reloads page', () => {
        const { getByText } = render(<BrowserRouter><Sidebar /></BrowserRouter>);

        fireEvent.click(getByText("Refresh"));  // click refresh button
        expect(window.location.reload).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/scheduler');
    });
});