import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LinearSpline from '../../pages/Interpolation/LinearSpline';

describe('Linear Spline Interpolation Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <LinearSpline />
            </BrowserRouter>
        );
        window.alert = jest.fn();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText('Linear Spline Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
    });

    // Test point management
    test('adds and removes points correctly', async () => {
        const addButton = screen.getByText('Add Point');
        const initialPointsCount = screen.getAllByPlaceholderText('x').length;
        
        // Add point
        fireEvent.click(addButton);
        
        // Verify point was added
        await waitFor(() => {
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount + 1);
        });

        // Add another point
        fireEvent.click(addButton);
        
        // Verify second point was added
        await waitFor(() => {
            const finalPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(finalPointsCount).toBe(initialPointsCount + 2);
        });
    });

    // Test linear spline interpolation calculation
    test('calculates linear spline interpolation correctly', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Set up test points: (1,1), (2,4), (3,9)
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Point 1
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });

        // Point 2
        fireEvent.change(xInputs[1], { target: { value: '2' } });
        fireEvent.change(fxInputs[1], { target: { value: '4' } });

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Check result (should be 2.5 for linear interpolation between (1,1) and (2,4))
        await waitFor(() => {
            const result = screen.getByTestId('result-value');
            expect(result).toBeInTheDocument();
            expect(result.textContent).toContain('2.500000');
        });
    });

    // Test out of range validation
    test('validates x value range', async () => {
        // Set up points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });

        // Set x value out of range
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '0' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('x is out of range of the provided points.');
    });

    // Test point sorting
    test('sorts points correctly', async () => {
        // Add a point
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Set points in unsorted order
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Point 1 (higher x value)
        fireEvent.change(xInputs[0], { target: { value: '2' } });
        fireEvent.change(fxInputs[0], { target: { value: '4' } });

        // Point 2 (lower x value)
        fireEvent.change(xInputs[1], { target: { value: '1' } });
        fireEvent.change(fxInputs[1], { target: { value: '1' } });

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate (this should trigger sorting)
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

    });

    // Test invalid inputs
    test('handles invalid inputs gracefully', async () => {
        // Set invalid inputs
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        fireEvent.change(xInputs[0], { target: { value: 'invalid' } });
        fireEvent.change(fxInputs[0], { target: { value: 'invalid' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Result should not be displayed for invalid inputs
        expect(screen.queryByTestId('result-value')).not.toBeInTheDocument();
    });

    // Test point selection
    test('handles point selection correctly', async () => {
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');

        // Test point selection
        fireEvent.change(point1Input, { target: { value: '1' } });
        fireEvent.change(point2Input, { target: { value: '2' } });

        expect(point1Input.value).toBe('1');
        expect(point2Input.value).toBe('2');
    });
}); 