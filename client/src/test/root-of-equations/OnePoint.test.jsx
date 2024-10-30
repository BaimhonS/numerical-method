import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnePoint from '../../pages/rootOfEquations/OnePoint';
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

describe('One-Point Component', () => {
  // Render component before each test
  beforeEach(() => {
    jest.clearAllMocks();
    render(<OnePoint />);
  });

  it('should render all components correctly', () => {
    // Check for main title using case-insensitive regex
    expect(screen.getByText(/one-point method/i)).toBeInTheDocument();

    // Check for input fields using label text
    expect(screen.getByText(/equation/i)).toBeInTheDocument();
    expect(screen.getByText(/error/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get example input/i })).toBeInTheDocument();
  });

  it('should fetch and display example data correctly', async () => {
    const mockData = {
      equation: '(1+x)/2',
      e: 0.000001
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    fireEvent.click(screen.getByRole('button', { name: /get example input/i }));

    await waitFor(() => {
      const equationInput = screen.getByRole('textbox');
      const errorInput = screen.getByRole('spinbutton');
      expect(equationInput).toHaveValue(mockData.equation);
      expect(errorInput).toHaveValue(mockData.e);
    });
  });

  it('should handle input changes', () => {
    const equationInput = screen.getByRole('textbox');
    const errorInput = screen.getByRole('spinbutton');

    fireEvent.change(equationInput, { target: { value: '(1+x)/2' } });
    fireEvent.change(errorInput, { target: { value: '0.0001' } });

    expect(equationInput).toHaveValue('(1+x)/2');
    expect(errorInput).toHaveValue(0.0001);
  });

  it('should calculate and show results', async () => {
    const equationInput = screen.getByRole('textbox');
    const errorInput = screen.getByRole('spinbutton');
    const calculateButton = screen.getByRole('button', { name: /calculate/i });

    fireEvent.change(equationInput, { target: { value: '(1+x)/2' } });
    fireEvent.change(errorInput, { target: { value: '0.0001' } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    fireEvent.click(screen.getByRole('button', { name: /get example input/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle calculation with different equations', async () => {
    const equationInput = screen.getByRole('textbox');
    const errorInput = screen.getByRole('spinbutton');
    const calculateButton = screen.getByRole('button', { name: /calculate/i });

    fireEvent.change(equationInput, { target: { value: '1/x' } });
    fireEvent.change(errorInput, { target: { value: '0.0001' } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('should limit iterations to prevent infinite loops', async () => {
    const equationInput = screen.getByRole('textbox');
    const errorInput = screen.getByRole('spinbutton');
    const calculateButton = screen.getByRole('button', { name: /calculate/i });

    fireEvent.change(equationInput, { target: { value: 'x^2' } });
    fireEvent.change(errorInput, { target: { value: '0.0000001' } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeLessThanOrEqual(51);
    });
  });
}); 