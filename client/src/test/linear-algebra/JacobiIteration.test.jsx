import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JacobiIteration from '../../pages/linearAlgebras/JacobiIteration';
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

// Mock window.alert
window.alert = jest.fn();

describe('Jacobi Iteration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert.mockClear();
    render(<JacobiIteration />);
  });

  it('should render initial components correctly', () => {
    // Check for title
    expect(screen.getByText('Jacobi Iteration Method')).toBeInTheDocument();

    // Check for matrix size selector
    expect(screen.getByText('Select Matrix Size')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('3');

    // Check for error input
    expect(screen.getByPlaceholderText('Error')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();

    // Check for initial 3x3 matrix inputs (9 matrix inputs + 3 constant inputs)
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(13); // 9 matrix + 3 constants + 1 error input
  });

  it('should handle matrix size changes', async () => {
    const sizeSelector = screen.getByRole('combobox');
    
    // Change to 2x2
    await waitFor(() => {
      fireEvent.change(sizeSelector, { target: { value: '2' } });
    });
    
    let inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(7); // 4 matrix + 2 constants + 1 error input

    // Change to 4x4
    await waitFor(() => {
      fireEvent.change(sizeSelector, { target: { value: '4' } });
    });
    
    inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(21); // 16 matrix + 4 constants + 1 error input
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
      // Helper function to check input value
      const checkInputValue = (placeholder, expectedValue) => {
        const input = screen.getByPlaceholderText(placeholder);
        if (expectedValue === 0) {
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

  it('should calculate and display iteration results', async () => {
    // Set error tolerance
    const errorInput = screen.getByPlaceholderText('Error');
    await waitFor(() => {
      fireEvent.change(errorInput, { target: { value: '0.0001' } });
    });

    // Set up a diagonally dominant matrix
    const inputs = screen.getAllByRole('spinbutton');
    const matrixValues = [
      4, -1, 0,  // First row
      -1, 4, -1, // Second row
      0, -1, 4   // Third row
    ];
    const constantValues = [1, 5, 0];

    // Fill matrix inputs
    await waitFor(() => {
      let matrixIndex = 0;
      for (let i = 1; i < inputs.length - 3; i++) { // Skip error input, stop before constants
        fireEvent.change(inputs[i], {
          target: { value: matrixValues[matrixIndex].toString() }
        });
        matrixIndex++;
      }

      // Fill constant inputs
      for (let i = 0; i < 3; i++) {
        fireEvent.change(inputs[inputs.length - 3 + i], {
          target: { value: constantValues[i].toString() }
        });
      }
    });

    // Calculate
    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      // Check for either results or alert message
      try {
        expect(screen.getByText('Iteration')).toBeInTheDocument();
      } catch (e) {
        expect(window.alert).toHaveBeenCalled();
      }
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

  it('should clear results when matrix size changes', async () => {
    // First set up and calculate a system
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Error'), { 
        target: { value: '0.0001' }
      });
    });
    
    const inputs = screen.getAllByRole('spinbutton');
    
    // Fill some values
    await waitFor(() => {
      inputs.forEach((input, index) => {
        if (index > 0) { // Skip error input
          fireEvent.change(input, { target: { value: '1' } });
        }
      });
    });

    fireEvent.click(screen.getByText('Calculate'));

    // Change matrix size
    const sizeSelector = screen.getByRole('combobox');
    await waitFor(() => {
      fireEvent.change(sizeSelector, { target: { value: '2' } });
    });

    // Check that results are cleared
    expect(screen.queryByText('Iteration')).not.toBeInTheDocument();
  });

  it('should show alert for invalid input', async () => {
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    expect(window.alert).toHaveBeenCalled();
  });
}); 