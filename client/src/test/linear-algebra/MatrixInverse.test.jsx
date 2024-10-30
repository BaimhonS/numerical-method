import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MatrixInverse from '../../pages/linearAlgebras/MatrixInverse';
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

describe('Matrix Inverse Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<MatrixInverse />);
  });

  it('should render initial components correctly', () => {
    // Check for title
    expect(screen.getByText('Matrix Inverse')).toBeInTheDocument();

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
      matrix_data: '4,0,0,0,4,0,0,0,4',
      constant_data: '1,2,3'
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
      checkInputValue('a12', 0);
      checkInputValue('a13', 0);
      checkInputValue('x1', 1);

      checkInputValue('a21', 0);
      checkInputValue('a22', 4);
      checkInputValue('a23', 0);
      checkInputValue('x2', 2);

      checkInputValue('a31', 0);
      checkInputValue('a32', 0);
      checkInputValue('a33', 4);
      checkInputValue('x3', 3);
    });
  });

  it('should calculate and display inverse matrix and solution', async () => {
    // Set up a simple diagonal matrix
    const inputs = screen.getAllByRole('spinbutton');
    const matrixValues = [
      2, 0, 0,  // First row
      0, 2, 0,  // Second row
      0, 0, 2   // Third row
    ];
    const constantValues = [2, 4, 6];

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
      // Check for inverse matrix header
      expect(screen.getByText('Inverse Matrix')).toBeInTheDocument();

      // Check for solution values
      const solutions = screen.getAllByText(/X\d = \d+\.\d+/);
      expect(solutions).toHaveLength(3);
      expect(solutions[0]).toHaveTextContent('X1 = 1.000000');
      expect(solutions[1]).toHaveTextContent('X2 = 2.000000');
      expect(solutions[2]).toHaveTextContent('X3 = 3.000000');
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
      const solution = screen.getByText('X1 = 2.000000');
      expect(solution).toBeInTheDocument();
    });
  });
}); 