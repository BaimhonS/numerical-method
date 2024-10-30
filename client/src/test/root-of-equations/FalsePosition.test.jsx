import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FalsePosition from '../../pages/rootOfEquations/FalsePosition';
import '@testing-library/jest-dom';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
  return function DummySidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn()
}));

const axios = require('axios');

describe('False Position Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<FalsePosition />);
  });

  test('renders component and its elements', () => {
    // Check for main title
    expect(screen.getByText('False Position Method')).toBeInTheDocument();

    // Check for input fields
    expect(screen.getByPlaceholderText('Equation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Xl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Xr')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Error')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
  });

  test('fetches and displays example data on button click', async () => {
    const mockData = {
      equation: 'x^2 - 4',
      xl: 0,
      xr: 3,
      e: 0.000001
    };

    // Setup mock response
    axios.get.mockResolvedValueOnce({ data: mockData });

    // Click the example button
    const exampleButton = screen.getByText('Get Example Input');
    fireEvent.click(exampleButton);

    // Wait for and verify the updates
    await waitFor(() => {
      const equationInput = screen.getByPlaceholderText('Equation');
      const xlInput = screen.getByPlaceholderText('Xl');
      const xrInput = screen.getByPlaceholderText('Xr');
      const errorInput = screen.getByPlaceholderText('Error');

      expect(equationInput).toHaveValue('x^2 - 4');
      expect(xlInput).toHaveValue(0);
      expect(xrInput).toHaveValue(3);
      expect(errorInput).toHaveValue(0.000001);
    });
  });

  test('handles input changes correctly', () => {
    const equationInput = screen.getByPlaceholderText('Equation');
    const xlInput = screen.getByPlaceholderText('Xl');
    const xrInput = screen.getByPlaceholderText('Xr');
    const errorInput = screen.getByPlaceholderText('Error');

    // Test equation input
    fireEvent.change(equationInput, { target: { value: 'x^2 - 7' } });
    expect(equationInput.value).toBe('x^2 - 7');

    // Test Xl input
    fireEvent.change(xlInput, { target: { value: '2' } });
    expect(xlInput.value).toBe('2');

    // Test Xr input
    fireEvent.change(xrInput, { target: { value: '4' } });
    expect(xrInput.value).toBe('4');

    // Test Error input
    fireEvent.change(errorInput, { target: { value: '0.0001' } });
    expect(errorInput.value).toBe('0.0001');
  });

  test('calculates and displays results when Calculate is clicked', async () => {
    // Set input values
    const equationInput = screen.getByPlaceholderText('Equation');
    const xlInput = screen.getByPlaceholderText('Xl');
    const xrInput = screen.getByPlaceholderText('Xr');
    const errorInput = screen.getByPlaceholderText('Error');

    fireEvent.change(equationInput, { target: { value: 'x^2 - 4' } });
    fireEvent.change(xlInput, { target: { value: '0' } });
    fireEvent.change(xrInput, { target: { value: '3' } });
    fireEvent.change(errorInput, { target: { value: '0.000001' } });

    // Click calculate button
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);

    // Wait for results to be displayed
    await waitFor(() => {
      // Check if table is present
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check table headers using more specific selectors
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Iteration');
      expect(headers[1]).toHaveTextContent('Xl');
      expect(headers[2]).toHaveTextContent('Xm');
      expect(headers[3]).toHaveTextContent('Xr');

      // Check if results are displayed
      expect(screen.getByText(/X :/)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    // Click the example button
    const exampleButton = screen.getByText('Get Example Input');
    fireEvent.click(exampleButton);

    // Wait for error handling
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
