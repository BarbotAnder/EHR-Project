import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

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

describe('Renders Login Page', () => {

  test('Pathname is "/"', () => {
    render(<App />);
    expect(location.pathname).toBe('/');
  });

  test('Login button is displayed on the screen', () => {
    render(<App />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Login');
  });
});