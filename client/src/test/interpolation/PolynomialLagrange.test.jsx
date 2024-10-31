import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PolynomialLagrange from '../../pages/Interpolation/PolynomialLagange';

describe('Polynomial Lagrange Interpolation Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <PolynomialLagrange />
            </BrowserRouter>
        );
        window.alert = jest.fn();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText('Polynomial Lagrange Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
    });

    // Test adding points
    test('adds points correctly', async () => {
        const addButton = screen.getByText('Add Point');
        const initialPointsCount = screen.getAllByPlaceholderText('x').length;
        
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount + 1);
        });
    });

    // Test removing points
    test('removes points correctly', async () => {
        // Add a point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Get remove buttons
        const removeButtons = screen.getAllByText('Remove');
        const initialPointsCount = screen.getAllByPlaceholderText('x').length;

        fireEvent.click(removeButtons[0]);

        await waitFor(() => {
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount - 1);
        });
    });

    // Test minimum points requirement
    test('validates minimum points requirement', async () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });

    // Test calculation with valid inputs
    test('calculates interpolation correctly', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
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

        // Point 3: (3,9)
        fireEvent.change(xInputs[2], { target: { value: '3' } });
        fireEvent.change(fxInputs[2], { target: { value: '9' } });

        // Set x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '2.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Check result
        await waitFor(() => {
            const result = screen.getByTestId('result-value');
            expect(result).toBeInTheDocument();
            expect(result.textContent).toContain('6.250000');
        });
    });

    // Test invalid inputs
    test('validates numeric inputs', async () => {
        // Add points first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please fill in all points with valid numeric values.');
    });

    // Test point selection
    test('handles point selection correctly', async () => {
        // Add points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set point values
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });
        fireEvent.change(xInputs[1], { target: { value: '2' } });
        fireEvent.change(fxInputs[1], { target: { value: '4' } });
        fireEvent.change(xInputs[2], { target: { value: '3' } });
        fireEvent.change(fxInputs[2], { target: { value: '9' } });

        // Select points using index inputs
        const pointSelectors = screen.getAllByPlaceholderText(/Point \d+ index/);
        fireEvent.change(pointSelectors[0], { target: { value: '1' } });
        fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        fireEvent.change(pointSelectors[2], { target: { value: '3' } });

        // Set interpolation x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '2.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Check result
        await waitFor(() => {
            const result = screen.getByText(/Interpolated y value:/);
            expect(result).toBeInTheDocument();
            // The result should follow quadratic interpolation pattern
            expect(result).toHaveTextContent(/6\.250000/);
        });
    });

    // Test input validation
    test('handles invalid inputs gracefully', async () => {
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        
        // Test with invalid input
        fireEvent.change(xInputs[0], { target: { value: 'invalid' } });
        fireEvent.change(fxInputs[0], { target: { value: 'invalid' } });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please select at least two points.');
    });

    test('validates numeric inputs', async () => {
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });
}); 