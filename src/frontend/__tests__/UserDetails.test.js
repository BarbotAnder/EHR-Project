import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserDetails from '../user/UserDetails';

// test('', () => {});

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

const routes = (<BrowserRouter><UserDetails /></BrowserRouter>);

const user = {
    id: 5,
    account_type: 'inactive',
    first_name: 'inactive',
    last_name: 'test',
    email: 'inactive@test.com'
};

const updatedUser = {
    account_type: 'patient',
    first_name: 'inactiveUpdate',
    last_name: 'testUpdate',
    email: 'inactiveUpdate@test.com'
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: user.id }),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-select', () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
            (option) => option.value === event.currentTarget.value
        );
        onChange(option);
    }

    return (
        <select data-testid='account_type' defaultValue={user.account_type} value={value} onChange={handleChange}>
            {options.map(({ name, value }) => (
                <option key={value} value={value}>
                    {name}
                </option>
            ))}
        </select>
    );
});

beforeEach(() => {
  mockedUsedNavigate.mockReset();
});

describe('User Details', () => {
    test('User Details renders for account_type="admin"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });
        const mockDetailsResponse = {
            data: {
                user
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByTestId } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        await waitFor(() => {
            expect(getByText('Update User Form')).toBeInTheDocument();
            expect(getByText('Account Type:')).toBeInTheDocument();
            expect(getByTestId('account_type')).toHaveValue('inactive');
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByTestId('first_name').value).toBe(user.first_name);
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByTestId('last_name').value).toBe(user.last_name);
            expect(getByText('Email:')).toBeInTheDocument();
            expect(getByTestId('email').value).toBe(user.email);
        });
    });

    test('User Details does not render for account_type="practitioner"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=practitioner',
        });

        const { getByText, queryByText } = render(routes);

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        expect(queryByText('Update User Form')).not.toBeInTheDocument();
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('User Details does not render for account_type="office"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=office',
        });

        const { getByText, queryByText } = render(routes);

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        expect(queryByText('Update User Form')).not.toBeInTheDocument();
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('User Details does not render for account_type="patient"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=patient',
        });

        const { getByText, queryByText } = render(routes);

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        expect(queryByText('Update User Form')).not.toBeInTheDocument();
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('User Details does not render for account_type="inactive"', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=inactive',
        });

        const { getByText, queryByText } = render(routes);

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        expect(queryByText('Update User Form')).not.toBeInTheDocument();
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('User Details does not render for not account_type', async () => {
        const { getByText, queryByText } = render(routes);

        expect(axios.post).not.toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        expect(queryByText('Update User Form')).not.toBeInTheDocument();
        expect(getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    test('User Details can be updated and navigates back to user-management', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });
        const mockDetailsResponse = {
            data: {
                user
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByTestId, getByRole } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        await waitFor(() => {
            expect(getByText('Update User Form')).toBeInTheDocument();
            expect(getByText('Account Type:')).toBeInTheDocument();
            expect(getByTestId('account_type')).toHaveValue('inactive');
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByTestId('first_name').value).toBe(user.first_name);
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByTestId('last_name').value).toBe(user.last_name);
            expect(getByText('Email:')).toBeInTheDocument();
            expect(getByTestId('email').value).toBe(user.email);
        });

        act(() => {
            fireEvent.change(getByTestId('account_type'), { target: { value: updatedUser.account_type } });
            fireEvent.change(getByTestId('first_name'), { target: { value: updatedUser.first_name } });
            fireEvent.change(getByTestId('last_name'), { target: { value: updatedUser.last_name } });
            fireEvent.change(getByTestId('email'), { target: { value: updatedUser.email } });

            expect(getByTestId('account_type').value).toBe(updatedUser.account_type);
            expect(getByTestId('first_name').value).toBe(updatedUser.first_name);
            expect(getByTestId('last_name').value).toBe(updatedUser.last_name);
            expect(getByTestId('email').value).toBe(updatedUser.email);

            fireEvent.click(getByRole('button', { name: 'Update' }));
            expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/update-user/5', updatedUser);
        });

        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/user-management');
        });
    });

    test('Cancel button navigates back to user-management when clicked', async () => {
        // set cookies
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'account_type=admin',
        });
        const mockDetailsResponse = {
            data: {
                user
            }
        };

        axios.post.mockResolvedValue(mockDetailsResponse);

        const { getByText, getByTestId, getByRole } = render(routes);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/user-details-by-id', 
            { id: 5 }
        );

        await waitFor(() => {
            expect(getByText('Update User Form')).toBeInTheDocument();
            expect(getByText('Account Type:')).toBeInTheDocument();
            expect(getByTestId('account_type')).toHaveValue('inactive');
            expect(getByText('First Name:')).toBeInTheDocument();
            expect(getByTestId('first_name').value).toBe(user.first_name);
            expect(getByText('Last Name:')).toBeInTheDocument();
            expect(getByTestId('last_name').value).toBe(user.last_name);
            expect(getByText('Email:')).toBeInTheDocument();
            expect(getByTestId('email').value).toBe(user.email);
        });

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Cancel' }));
        });

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/user-management');
    });
});