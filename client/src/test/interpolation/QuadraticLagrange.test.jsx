import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuadraticLagrange from '../../pages/Interpolation/QuadraticLargange';

describe('Quadratic Lagrange Interpolation Component', () => {
    beforeEach(() => {
        render(<QuadraticLagrange />);
        window.alert = jest.fn();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText('Quadratic Lagrange Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
        expect(screen.getByText('Select Point 1')).toBeInTheDocument();
        expect(screen.getByText('Select Point 2')).toBeInTheDocument();
        expect(screen.getByText('Select Point 3')).toBeInTheDocument();
    });

    // Test point management
    test('adds and removes points correctly', async () => {
        // Test adding points
        const addButton = screen.getByText('Add Point');
        const initialPointsCount = screen.getAllByPlaceholderText('x').length;
        
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount + 2);
        });

        // Test removing points
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        await waitFor(() => {
            const finalPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(finalPointsCount).toBe(initialPointsCount + 1);
        });
    });

    // Test quadratic interpolation calculation
    test('calculates quadratic interpolation correctly', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set up test points: (1,1), (2,4), (3,9) - quadratic function y = x^2
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Point 1
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });

        // Point 2
        fireEvent.change(xInputs[1], { target: { value: '2' } });
        fireEvent.change(fxInputs[1], { target: { value: '4' } });

        // Point 3
        fireEvent.change(xInputs[2], { target: { value: '3' } });
        fireEvent.change(fxInputs[2], { target: { value: '9' } });

        // Set point selections
        const pointSelectors = [
            screen.getByPlaceholderText('Point 1 index'),
            screen.getByPlaceholderText('Point 2 index'),
            screen.getByPlaceholderText('Point 3 index')
        ];

        fireEvent.change(pointSelectors[0], { target: { value: '1' } });
        fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        fireEvent.change(pointSelectors[2], { target: { value: '3' } });

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '2.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Check result (for x = 2.5, y should be approximately 6.25)
        await waitFor(() => {
            const result = screen.getByText(/Interpolated y value:/);
            expect(result).toBeInTheDocument();
            expect(result).toHaveTextContent('6.250000');
        });
    });

    // Test validation
    test('validates minimum points requirement', async () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });

    // Test point selection adjustment after removal
    test('adjusts point selection after point removal', async () => {
        // Add points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set initial point selections
        const pointSelectors = [
            screen.getByPlaceholderText('Point 1 index'),
            screen.getByPlaceholderText('Point 2 index'),
            screen.getByPlaceholderText('Point 3 index')
        ];

        fireEvent.change(pointSelectors[0], { target: { value: '1' } });
        fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        fireEvent.change(pointSelectors[2], { target: { value: '3' } });

        // Remove a point
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        // Check if point selections were adjusted
        await waitFor(() => {
            expect(pointSelectors[0].value).toBe('1');
            expect(pointSelectors[1].value).toBe('2');
            expect(pointSelectors[2].value).toBe('2');
        });
    });

    // Test edge cases
    test('handles edge cases correctly', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set up identical points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Set all points to (1,1)
        xInputs.forEach(input => {
            fireEvent.change(input, { target: { value: '1' } });
        });
        fxInputs.forEach(input => {
            fireEvent.change(input, { target: { value: '1' } });
        });

        // Set x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Result should be 1 for interpolation at x=1
        await waitFor(() => {
            const result = screen.getByText(/Interpolated y value:/);
            expect(result).toBeInTheDocument();
            expect(result).toHaveTextContent('1.000000');
        });
    });
}); 