import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Graphical from '../../pages/rootOfEquations/Graphical';
import '@testing-library/jest-dom';

// Mock recharts to avoid rendering issues
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

describe('Graphical Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    render(<Graphical />);
  });

  test('renders component and its elements', () => {
    expect(screen.getByText('Graphical Method')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Equation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Scan')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
  });

  test('fetches and displays example data on button click', async () => {
    const mockData = {
      equation: 'x^2 - 4',
      scan: 0.1
    };

    // Setup mock response
    axios.get.mockResolvedValueOnce({ data: mockData });

    // Click the example button
    const exampleButton = screen.getByText('Get Example Input');
    fireEvent.click(exampleButton);

    // Wait for and verify the updates
    await waitFor(() => {
      const equationInput = screen.getByPlaceholderText('Equation');
      const scanInput = screen.getByPlaceholderText('Scan');
      expect(equationInput).toHaveValue('x^2 - 4');
      expect(scanInput).toHaveValue(0.1);
    });
  });

  test('calculates and displays results when Calculate is clicked', async () => {
    // Set input values
    const equationInput = screen.getByPlaceholderText('Equation');
    const scanInput = screen.getByPlaceholderText('Scan');

    fireEvent.change(equationInput, { target: { value: 'x^2 - 4' } });
    fireEvent.change(scanInput, { target: { value: '0.1' } });

    // Click calculate button
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);

    // Check for loading state
    expect(screen.getByText('Wait calculating...')).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.queryByText('Wait calculating...')).not.toBeInTheDocument();
      expect(screen.getByText(/X :/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('handles input changes correctly', () => {
    const equationInput = screen.getByPlaceholderText('Equation');
    const scanInput = screen.getByPlaceholderText('Scan');

    // Test equation input
    fireEvent.change(equationInput, { target: { value: 'x^3 - 2x + 1' } });
    expect(equationInput.value).toBe('x^3 - 2x + 1');

    // Test scan input
    fireEvent.change(scanInput, { target: { value: '0.2' } });
    expect(scanInput.value).toBe('0.2');
  });
});
