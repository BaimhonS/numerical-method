import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GaussSeidelIteration from '../../pages/linearAlgebras/GaussSeidelIteration';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
  return function DummySidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

describe('Gauss-Seidel Iteration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<GaussSeidelIteration />);
  });

  it('should render initial components correctly', () => {
    // Check for title
    expect(screen.getByText('Gauss-Seidel Iteration Method')).toBeInTheDocument();

    // Check for matrix size selector
    expect(screen.getByText('Select Matrix Size')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('3'); // Default size is 3

    // Check for error input
    expect(screen.getByPlaceholderText('Error')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();

    // Check for initial 3x3 matrix inputs (9 matrix inputs + 3 constant inputs)
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(13); // 9 matrix + 3 constants + 1 error input
  });

  it('should handle matrix size changes', () => {
    const sizeSelector = screen.getByRole('combobox');
    
    // Change to 2x2
    fireEvent.change(sizeSelector, { target: { value: '2' } });
    let inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(7); // 4 matrix inputs + 2 constant inputs + 1 error input

    // Change to 4x4
    fireEvent.change(sizeSelector, { target: { value: '4' } });
    inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(21); // 16 matrix inputs + 4 constant inputs + 1 error input
  });

  it('should fetch and display example data correctly', async () => {
    const mockData = {
      matrix_size: 3,
      error: 0.000001,
      matrix_data: '4,-1,0,-1,4,-1,0,-1,4',
      constant_data: '1,5,0'
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    fireEvent.click(screen.getByText('Get Example Input'));

    await waitFor(() => {
      // Check error input
      expect(screen.getByPlaceholderText('Error')).toHaveValue(0.000001);

      // Helper function to check input value
      const checkInputValue = (placeholder, expectedValue) => {
        const input = screen.getByPlaceholderText(placeholder);
        if (expectedValue === 0) {
          // For zero values, check if it's either "0" or empty string
          expect(input.value === "0" || input.value === "").toBeTruthy();
        } else {
          expect(input).toHaveValue(expectedValue);
        }
      };

      // Check matrix values
      checkInputValue('a11', 4);
      checkInputValue('a12', -1);
      checkInputValue('a13', 0);
      checkInputValue('x1', 1);

      checkInputValue('a21', -1);
      checkInputValue('a22', 4);
      checkInputValue('a23', -1);
      checkInputValue('x2', 5);

      checkInputValue('a31', 0);
      checkInputValue('a32', -1);
      checkInputValue('a33', 4);
      checkInputValue('x3', 0);
    });
  });

  it('should calculate and display results for a convergent system', async () => {
    // Set error tolerance first
    const errorInput = screen.getByPlaceholderText('Error');
    fireEvent.change(errorInput, { target: { value: '0.0001' } });

    // Set matrix values using placeholders
    const matrixInputs = {
      'a11': 4, 'a12': -1, 'a13': 0,
      'a21': -1, 'a22': 4, 'a23': -1,
      'a31': 0, 'a32': -1, 'a33': 4
    };

    const constantInputs = {
      'x1': 1,
      'x2': 5,
      'x3': 0
    };

    // Fill matrix inputs
    Object.entries(matrixInputs).forEach(([placeholder, value]) => {
      fireEvent.change(screen.getByPlaceholderText(placeholder), {
        target: { value: value.toString() }
      });
    });

    // Fill constant inputs
    Object.entries(constantInputs).forEach(([placeholder, value]) => {
      fireEvent.change(screen.getByPlaceholderText(placeholder), {
        target: { value: value.toString() }
      });
    });

    // Calculate
    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      expect(screen.getByText('Iteration')).toBeInTheDocument();
      const finalResults = screen.getAllByText(/X[1-3] :/);
      expect(finalResults).toHaveLength(3);
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    fireEvent.click(screen.getByText('Get Example Input'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'There was an error fetching the example input!',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should clear results when matrix size changes', () => {
    // First set up and calculate a system
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(screen.getByPlaceholderText('Error'), { 
      target: { value: '0.0001' }
    });
    
    // Fill some values
    inputs.forEach((input, index) => {
      if (index > 0) { // Skip error input
        fireEvent.change(input, { target: { value: '1' } });
      }
    });

    fireEvent.click(screen.getByText('Calculate'));

    // Change matrix size
    const sizeSelector = screen.getByRole('combobox');
    fireEvent.change(sizeSelector, { target: { value: '2' } });

    // Check that results are cleared
    expect(screen.queryByText('Iteration')).not.toBeInTheDocument();
  });
}); 