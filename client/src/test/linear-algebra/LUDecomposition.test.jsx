import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LUDecomposition from '../../pages/linearAlgebras/LUDecomposition';
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

describe('LU Decomposition Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<LUDecomposition />);
  });

  it('should render initial components correctly', () => {
    // Check for title
    expect(screen.getByText('LU Decomposition')).toBeInTheDocument();

    // Check for matrix size selector
    expect(screen.getByText('Select Matrix Size')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('3');

    // Check for buttons
    expect(screen.getByText('Get Example Input')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();

    // Check for initial 3x3 matrix inputs (9 matrix inputs + 3 constant inputs)
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(12);
  });

  it('should handle matrix size changes', () => {
    const sizeSelector = screen.getByRole('combobox');
    
    // Change to 2x2
    fireEvent.change(sizeSelector, { target: { value: '2' } });
    let inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(6); // 4 matrix + 2 constants

    // Change to 4x4
    fireEvent.change(sizeSelector, { target: { value: '4' } });
    inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(20); // 16 matrix + 4 constants
  });

  it('should fetch and display example data correctly', async () => {
    const mockData = {
      matrix_size: 3,
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

  it('should calculate and display LU decomposition results', async () => {
    // Set up a simple matrix
    const inputs = screen.getAllByRole('spinbutton');
    const matrixValues = [
      4, -1, 0,  // First row
      -1, 4, -1, // Second row
      0, -1, 4   // Third row
    ];
    const constantValues = [1, 5, 0];

    // Fill matrix inputs (accounting for constant inputs)
    let matrixIndex = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        fireEvent.change(inputs[row * 4 + col], { 
          target: { value: matrixValues[matrixIndex].toString() }
        });
        matrixIndex++;
      }
      // Fill constant input for this row
      fireEvent.change(inputs[row * 4 + 3], {
        target: { value: constantValues[row].toString() }
      });
    }

    // Calculate
    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      // Check for matrix headers
      expect(screen.getByText('L Matrix')).toBeInTheDocument();
      expect(screen.getByText('U Matrix')).toBeInTheDocument();

      // Check for equation headers
      expect(screen.getByText('LY = B')).toBeInTheDocument();
      expect(screen.getByText('UX = Y')).toBeInTheDocument();

      // Check for Y and X values
      const yValues = screen.getAllByText(/y\d = [-]?\d+\.\d+/);
      const xValues = screen.getAllByText(/x\d = [-]?\d+\.\d+/);
      expect(yValues).toHaveLength(3);
      expect(xValues).toHaveLength(3);
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

  it('should handle special case of identical matrix values', async () => {
    const inputs = screen.getAllByRole('spinbutton');
    
    // Fill all matrix inputs with 1
    for (let i = 0; i < 9; i++) {
      const inputIndex = Math.floor(i / 3) * 4 + (i % 3);
      fireEvent.change(inputs[inputIndex], { target: { value: '1' } });
    }

    // Fill all constants with 2
    for (let i = 0; i < 3; i++) {
      fireEvent.change(inputs[i * 4 + 3], { target: { value: '2' } });
    }

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      const xValue = screen.getByText('x1 = 2.000000');
      expect(xValue).toBeInTheDocument();
    });
  });
}); 