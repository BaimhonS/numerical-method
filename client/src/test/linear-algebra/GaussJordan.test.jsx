import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GaussJordan from '../../pages/linearAlgebras/GaussJordan';
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

describe('Gauss-Jordan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<GaussJordan />);
  });

  it('should render initial components correctly', () => {
    // Check for title
    expect(screen.getByText('Gauss-Jordan Elimination')).toBeInTheDocument();

    // Check for matrix size selector
    expect(screen.getByText('Select Matrix Size')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('3'); // Default size is 3

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
    expect(inputs).toHaveLength(6); // 4 matrix inputs + 2 constant inputs

    // Change to 4x4
    fireEvent.change(sizeSelector, { target: { value: '4' } });
    inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(20); // 16 matrix inputs + 4 constant inputs
  });

  it('should fetch and display example data correctly', async () => {
    const mockData = {
      matrix_size: 3,
      matrix_data: '1,2,3,4,5,6,7,8,9',
      constant_data: '1,2,3'
    };

    // Setup axios mock
    axios.get.mockResolvedValueOnce({ data: mockData });

    // Click the example input button
    fireEvent.click(screen.getByText('Get Example Input'));

    await waitFor(() => {
      const inputs = screen.getAllByRole('spinbutton');
      
      // First row: a11, a12, a13, x1
      expect(inputs[0]).toHaveValue(1);  // a11
      expect(inputs[1]).toHaveValue(2);  // a12
      expect(inputs[2]).toHaveValue(3);  // a13
      expect(inputs[3]).toHaveValue(1);  // x1

      // Second row: a21, a22, a23, x2
      expect(inputs[4]).toHaveValue(4);  // a21
      expect(inputs[5]).toHaveValue(5);  // a22
      expect(inputs[6]).toHaveValue(6);  // a23
      expect(inputs[7]).toHaveValue(2);  // x2

      // Third row: a31, a32, a33, x3
      expect(inputs[8]).toHaveValue(7);  // a31
      expect(inputs[9]).toHaveValue(8);  // a32
      expect(inputs[10]).toHaveValue(9); // a33
      expect(inputs[11]).toHaveValue(3); // x3
    });
  });

  it('should handle input changes', () => {
    const inputs = screen.getAllByRole('spinbutton');
    
    // Change first matrix input
    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(inputs[0]).toHaveValue(5);

    // Change last constant input
    fireEvent.change(inputs[11], { target: { value: '10' } });
    expect(inputs[11]).toHaveValue(10);
  });

  it('should calculate and display results', async () => {
    const inputs = screen.getAllByRole('spinbutton');
    
    // Set up a simple system
    const matrixValues = [
      1, 0, 0,  // First row
      0, 1, 0,  // Second row
      0, 0, 1   // Third row
    ];
    const constantValues = [1, 2, 3];

    // Fill matrix inputs (accounting for constant inputs after each row)
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
      expect(screen.getByText('Solution Steps')).toBeInTheDocument();
      const solutions = screen.getAllByText(/x[1-3] =/);
      expect(solutions).toHaveLength(3);
    });
  });

  it('should handle API errors gracefully', async () => {
    // Setup axios mock to reject
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Click the example input button
    fireEvent.click(screen.getByText('Get Example Input'));

    // Wait for error handling
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'There was an error fetching the example input!',
        expect.any(Error)
      );
    });

    // Cleanup
    consoleErrorSpy.mockRestore();
  });

  it('should handle special case when all inputs are equal', async () => {
    const inputs = screen.getAllByRole('spinbutton');
    
    // Set all inputs to 1
    inputs.forEach(input => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      // Check for solution steps
      expect(screen.getByText('Solution Steps')).toBeInTheDocument();
      
      // Check for solution values
      const solutions = screen.getAllByText(/x[1-3] =/);
      expect(solutions).toHaveLength(3);
    });
  });

  it('should handle matrix operations correctly', async () => {
    const inputs = screen.getAllByRole('spinbutton');
    
    // Set up a simple system that will require row operations
    const matrixValues = [2, 1, -1, -3, -1, 2, -2, 1, 2];
    const constantValues = [8, -11, -3];

    // Fill matrix inputs
    matrixValues.forEach((value, index) => {
      fireEvent.change(inputs[index], { target: { value: value.toString() } });
    });

    // Fill constant inputs
    constantValues.forEach((value, index) => {
      fireEvent.change(inputs[index * 4 + 3], { target: { value: value.toString() } });
    });

    // Calculate
    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      // Check for multiple steps
      const steps = screen.getAllByText(/Step \d+:/);
      expect(steps.length).toBeGreaterThan(1);
      
      // Check for solution display
      expect(screen.getAllByText(/x[1-3] =/).length).toBe(3);
    });
  });
}); 