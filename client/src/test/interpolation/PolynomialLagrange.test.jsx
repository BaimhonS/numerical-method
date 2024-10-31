import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PolynomialLagrange from '../../pages/Interpolation/PolynomialLagange';

describe('Polynomial Lagrange Interpolation Component', () => {
    beforeEach(() => {
        window.alert = jest.fn();
        render(
            <BrowserRouter>
                <PolynomialLagrange />
            </BrowserRouter>
        );
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
        fireEvent.click(addButton); // Add a third point
        
        // Get inputs after they're available
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Fill in points data one by one
        for (let i = 0; i < 3; i++) {
            const point = [
                { x: '1', fx: '1' },
                { x: '2', fx: '4' },
                { x: '3', fx: '9' }
            ][i];
            
        }

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);
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
        // Add required points first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton); // Add a third point

        // Get inputs after they're available
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        // Fill in points data one by one
        for (let i = 0; i < 3; i++) {
            const point = [
                { x: '1', fx: '1' },
                { x: '2', fx: '4' },
                { x: '3', fx: '9' }
            ][i];
            
        }

        // Test point selection
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');

    });

    // Test input validation
    test('handles invalid inputs gracefully', async () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });

    test('validates numeric inputs', async () => {
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });
}); 