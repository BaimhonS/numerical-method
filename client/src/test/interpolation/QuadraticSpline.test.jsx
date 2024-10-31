import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
import QuadraticSpline from '../../pages/Interpolation/QuadraticSpline';

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

describe('Quadratic Spline Interpolation Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <QuadraticSpline />
            </BrowserRouter>
        );
        // Clear mock calls
        jest.clearAllMocks();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText('Quadratic Spline Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Enter 3 X Values')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
    });

    // Test point management
    test('adds and removes points correctly', async () => {
        const addButton = screen.getByText('Add Point');
        const initialPointsCount = screen.getAllByPlaceholderText('x').length;
        
        // Add point
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount + 2);
        });

        // Remove point
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        await waitFor(() => {
            const finalPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(finalPointsCount).toBe(initialPointsCount + 1);
        });
    });

    // Test input validation
    test('validates minimum points requirement', async () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(toast.error).toHaveBeenCalledWith('Please enter at least 3 points');
    });

    test('validates point values', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set invalid point values
        const xInputs = screen.getAllByPlaceholderText('x');
        fireEvent.change(xInputs[0], { target: { value: 'invalid' } });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(toast.error).toHaveBeenCalledWith('All points must have valid x and f(x) values');
    });

    // Test calculation with valid inputs
    test('calculates quadratic spline correctly', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set point values
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Point 1: (0,0)
        fireEvent.change(xInputs[0], { target: { value: '0' } });
        fireEvent.change(fxInputs[0], { target: { value: '0' } });

        // Point 2: (1,1)
        fireEvent.change(xInputs[1], { target: { value: '1' } });
        fireEvent.change(fxInputs[1], { target: { value: '1' } });

        // Point 3: (2,4)
        fireEvent.change(xInputs[2], { target: { value: '2' } });
        fireEvent.change(fxInputs[2], { target: { value: '4' } });

        // Set x values for calculation
        const xValueInputs = screen.getAllByPlaceholderText(/x\d/);
        fireEvent.change(xValueInputs[0], { target: { value: '0.5' } });
        fireEvent.change(xValueInputs[1], { target: { value: '1.5' } });
        fireEvent.change(xValueInputs[2], { target: { value: '1.8' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Check if matrix is displayed
        await waitFor(() => {
            expect(screen.getByText('Matrix')).toBeInTheDocument();
        });

        // Check if coefficients are displayed
        await waitFor(() => {
            expect(screen.getByText('Coefficients')).toBeInTheDocument();
        });

        // Check if results are displayed
        await waitFor(() => {
            expect(screen.getByText('Results')).toBeInTheDocument();
        });
    });

    // Test x value validation
    test('validates x values', async () => {
        // Add required points and set valid point values
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set invalid x value
        const xValueInputs = screen.getAllByPlaceholderText(/x\d/);
        fireEvent.change(xValueInputs[0], { target: { value: 'invalid' } });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(toast.error).toHaveBeenCalledWith('Please enter valid x values for calculation');
    });

    // Test point selection
    test('handles point selection correctly', async () => {
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');
        const point3Input = screen.getByPlaceholderText('Point 3 index');

        fireEvent.change(point1Input, { target: { value: '1' } });
        fireEvent.change(point2Input, { target: { value: '2' } });
        fireEvent.change(point3Input, { target: { value: '3' } });

        expect(point1Input.value).toBe('1');
        expect(point2Input.value).toBe('2');
        expect(point3Input.value).toBe('3');
    });

    // Test error handling
    test('handles calculation errors gracefully', async () => {
        // Set up invalid calculation scenario
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set point values that will cause calculation error
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Set same x values to cause division by zero
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(xInputs[1], { target: { value: '1' } });
        fireEvent.change(xInputs[2], { target: { value: '1' } });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(toast.error).toHaveBeenCalled();
    });
}); 