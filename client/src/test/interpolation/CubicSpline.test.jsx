import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';
import '@testing-library/jest-dom';
import CubicSpline from '../../pages/Interpolation/CubicSpline';

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn()
    }
}));

// Mock mathjs
jest.mock('mathjs', () => ({
    det: jest.fn()
}));

describe('Cubic Spline Interpolation Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <CubicSpline />
            </BrowserRouter>
        );
        jest.clearAllMocks();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText('Cubic Spline Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
    });

    // Test input validation
    describe('Input Validation', () => {
        test('validates minimum points requirement', () => {
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(toast.error).toHaveBeenCalledWith('Need at least 2 points for interpolation');
        });

        test('validates point values', () => {
            const xInput = screen.getAllByPlaceholderText('x')[0];
            fireEvent.change(xInput, { target: { value: 'invalid' } });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(toast.error).toHaveBeenCalledWith('Invalid value at point 1');
        });

        test('validates x value order', async () => {
            // Add a point
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            // Set points in wrong order
            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            fireEvent.change(xInputs[0], { target: { value: '2' } });
            fireEvent.change(fxInputs[0], { target: { value: '4' } });
            fireEvent.change(xInputs[1], { target: { value: '1' } });
            fireEvent.change(fxInputs[1], { target: { value: '1' } });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(toast.error).toHaveBeenCalledWith('X values must be unique and in ascending order');
        });

        test('validates interpolation x value', () => {
            // Set up valid points first
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            // Set valid points
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            // Set invalid x value
            const xValueInput = screen.getByPlaceholderText('x value');
            fireEvent.change(xValueInput, { target: { value: '3' } });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(toast.error).toHaveBeenCalledWith('Interpolation x value must be within the range of points');
        });
    });

    // Test calculation functionality
    describe('Calculation Functionality', () => {
        beforeEach(() => {
            // Mock determinant calculation
            require('mathjs').det.mockImplementation(() => 1);
        });

        test('calculates cubic spline correctly', async () => {
            // Add required points
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            // Set point values
            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            // Point 1: (1,1)
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });

            // Point 2: (2,4)
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            // Set interpolation x value
            const xValueInput = screen.getByPlaceholderText('x value');
            fireEvent.change(xValueInput, { target: { value: '1.5' } });

            // Calculate
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            // Check if results are displayed
            await waitFor(() => {
                expect(screen.getByText(/System of Equations Matrix/)).toBeInTheDocument();
                expect(screen.getByText(/Coefficients and Results/)).toBeInTheDocument();
                expect(screen.getByText(/Interpolated Value at x =/)).toBeInTheDocument();
            });
        });

        test('handles singular matrix error', async () => {
            require('mathjs').det.mockImplementation(() => 0);

            // Set up calculation with valid inputs
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            // Set valid points
            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(toast.error).toHaveBeenCalledWith('The matrix is singular, no unique solution.');
        });
    });

    // Test point management
    test('manages points correctly', async () => {
        const addButton = screen.getByText('Add Point');
        
        // Add point
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const points = screen.getAllByPlaceholderText('x');
            expect(points.length).toBe(2);
        });

        // Remove point (if more than 2 points exist)
        const removeButtons = screen.getAllByText('Remove');
        if (removeButtons.length > 0) {
            fireEvent.click(removeButtons[0]);
            
            await waitFor(() => {
                const points = screen.getAllByPlaceholderText('x');
                expect(points.length).toBe(1);
            });
        }
    });
}); 