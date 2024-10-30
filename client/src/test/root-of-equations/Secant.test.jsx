import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Secant from '../../pages/rootOfEquations/Secant';
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

describe('Secant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<Secant />);
  });

  it('should render all components correctly', () => {
    // Check for main title
    expect(screen.getByText('Secant Method')).toBeInTheDocument();

    // Check for input fields
    expect(screen.getByPlaceholderText('Equation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('X0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('X1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Error')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
  });

  it('should fetch and display example data correctly', async () => {
    const mockData = {
      Equation: 'x^2 - 7',
      X0: 2,
      X1: 3,
      e: 0.000001
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    fireEvent.click(screen.getByText('Get Example Input'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Equation')).toHaveValue('x^2 - 7');
      expect(screen.getByPlaceholderText('X0')).toHaveValue(2);
      expect(screen.getByPlaceholderText('X1')).toHaveValue(3);
      expect(screen.getByPlaceholderText('Error')).toHaveValue(0.000001);
    });
  });

  it('should handle input changes', () => {
    const equationInput = screen.getByPlaceholderText('Equation');
    const x0Input = screen.getByPlaceholderText('X0');
    const x1Input = screen.getByPlaceholderText('X1');
    const errorInput = screen.getByPlaceholderText('Error');

    fireEvent.change(equationInput, { target: { value: 'x^2 - 7' } });
    fireEvent.change(x0Input, { target: { value: '2' } });
    fireEvent.change(x1Input, { target: { value: '3' } });
    fireEvent.change(errorInput, { target: { value: '0.0001' } });

    expect(equationInput).toHaveValue('x^2 - 7');
    expect(x0Input).toHaveValue(2);
    expect(x1Input).toHaveValue(3);
    expect(errorInput).toHaveValue(0.0001);
  });

  it('should calculate and display results', async () => {
    // Set input values
    fireEvent.change(screen.getByPlaceholderText('Equation'), { target: { value: 'x^2 - 7' } });
    fireEvent.change(screen.getByPlaceholderText('X0'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('X1'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('Error'), { target: { value: '0.000001' } });

    // Click calculate
    fireEvent.click(screen.getByText('Calculate'));

    // Wait for results
    await waitFor(() => {
      // Check if table is present
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check table headers
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Iteration');
      expect(headers[1]).toHaveTextContent('Xprev');
      expect(headers[2]).toHaveTextContent('Xold');
      expect(headers[3]).toHaveTextContent('Xnew');
      expect(headers[4]).toHaveTextContent('Error');

      // Check if final result is displayed
      expect(screen.getByText(/X :/)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    fireEvent.click(screen.getByText('Get Example Input'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle calculation with different equations', async () => {
    // Test with a different equation
    fireEvent.change(screen.getByPlaceholderText('Equation'), { target: { value: 'x^3 - x - 1' } });
    fireEvent.change(screen.getByPlaceholderText('X0'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('X1'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Error'), { target: { value: '0.0001' } });

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText(/X :/)).toBeInTheDocument();
    });
  });

  it('should limit iterations to prevent infinite loops', async () => {
    // Test with an equation that might need many iterations
    fireEvent.change(screen.getByPlaceholderText('Equation'), { target: { value: 'x^4 - x - 1' } });
    fireEvent.change(screen.getByPlaceholderText('X0'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('X1'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Error'), { target: { value: '0.0000001' } });

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Check that the number of iterations doesn't exceed 50 (header row + max 50 iterations)
      expect(rows.length).toBeLessThanOrEqual(51);
    });
  });
}); 