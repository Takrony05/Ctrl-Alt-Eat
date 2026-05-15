import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import * as api from '../services/api';

// Mock the entire module
jest.mock('../services/api');

// Destructure the mock to use in the component
const { useAuth } = require('../context/AuthContext');

const AuthTestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-role">{user ? user.role : 'guest'}</div>
      <button onClick={() => login({ email: 'chef@ejust.edu.eg', password: 'password' })}>Login Chef</button>
      <button onClick={() => login({ email: 'student@gmail.com', password: 'password' })}>Login Student</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();

    // Setup default mock implementations
    api.login.mockImplementation(async (data) => {
      const username = data?.username || '';
      if (username.endsWith('@ejust.edu.eg')) {
        return { data: { user: { role: 'chef' }, token: 'abc' } };
      }
      return { data: { user: { role: 'customer' }, token: 'def' } };
    });
    api.getMe.mockImplementation(async () => ({ data: { role: 'guest' } }));
    api.logout.mockImplementation(async () => ({}));
  });

  test('should detect chef role from email', async () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login Chef'));

    await waitFor(() => {
      expect(screen.getByTestId('user-role').textContent).toBe('chef');
    }, { timeout: 3000 });
  });

  test('should detect customer role from student email', async () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login Student'));

    await waitFor(() => {
      expect(screen.getByTestId('user-role').textContent).toBe('customer');
    }, { timeout: 3000 });
  });
});
