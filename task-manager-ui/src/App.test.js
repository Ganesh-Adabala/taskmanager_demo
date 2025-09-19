import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Login Form', () => {
  test('renders login form', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error for empty fields', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/username is required/i);
  });

  test('shows error for short username', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/username must be at least 3 characters/i);
  });

  test('shows error for short password', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/password must be at least 6 characters/i);
  });

  test('submits form with valid inputs', async () => {
    window.alert = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'User registered successfully.', userId: '12345' })
      })
    );
    render(<App />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // Wait for alert to be called
    await screen.findByRole('button', { name: /login/i });
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('User registered successfully.'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('User ID: 12345'));
    global.fetch.mockRestore();
  });
});
