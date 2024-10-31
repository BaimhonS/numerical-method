import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LinearRegression from '../../pages/least-squares-regression/LinearRegression';

describe('Linear Regression Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <LinearRegression />
            </BrowserRouter>
        );
        window.alert = jest.fn();
    });

    // Test initial render
    test('renders component correctly', () => {
        // Use getAllByText and check the h2 specifically
        const headings = screen.getAllByText('Linear Regression');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
        expect(screen.getByText('Calculate Linear Regression')).toBeInTheDocument();
    });

    // Test point management
    describe('Point Management', () => {
        test('adds points correctly', () => {
            const addButton = screen.getByText('Add Point');
            const initialPointsCount = screen.getAllByPlaceholderText('x').length;
            
            fireEvent.click(addButton);
            
            const newPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(newPointsCount).toBe(initialPointsCount + 1);
        });

        test('removes points correctly', () => {
            // Add a point first
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const removeButtons = screen.getAllByText('Remove');
            const initialPointsCount = screen.getAllByPlaceholderText('x').length;
            
            fireEvent.click(removeButtons[0]);
            
            const finalPointsCount = screen.getAllByPlaceholderText('x').length;
            expect(finalPointsCount).toBe(initialPointsCount - 1);
        });

        test('prevents removing last point', () => {
            const removeButtons = screen.queryAllByText('Remove');
            expect(removeButtons.length).toBe(0); // Should not show remove button for single point
        });
    });

    // Test input validation
    describe('Input Validation', () => {
        test('validates minimum points requirement', async () => {
            const calculateButton = screen.getByText('Calculate Linear Regression');
            fireEvent.click(calculateButton);
            
            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Please enter at least two points for linear regression.');
            });
        });

        test('validates f(x) calculation requirement', async () => {
            const calculateFxButton = screen.getByText('Calculate f(x)');
            fireEvent.click(calculateFxButton);
            
            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Please calculate linear regression first.');
            });
        });
    });

    // Test calculation functionality
    describe('Calculation Functionality', () => {
        test('calculates linear regression correctly', async () => {
            // Add a point
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            // Set point values
            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            // Point 1: (1,2)
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '2' } });

            // Point 2: (2,4)
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            // Calculate regression
            const calculateButton = screen.getByText('Calculate Linear Regression');
            fireEvent.click(calculateButton);

            // Check if regression equation is displayed
            await waitFor(() => {
                const equation = screen.getByText(/Linear Regression Equation:/);
                expect(equation).toBeInTheDocument();
                expect(equation.textContent).toMatch(/f\(x\) = 0\.000000 \+ 2\.000000x/);
            });
        });

        test('calculates f(x) correctly', async () => {
            // Set up regression first
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '2' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            const calculateButton = screen.getByText('Calculate Linear Regression');
            fireEvent.click(calculateButton);

            // Calculate f(x)
            const xValueInput = screen.getByPlaceholderText('x value');
            fireEvent.change(xValueInput, { target: { value: '1.5' } });

            const calculateFxButton = screen.getByText('Calculate f(x)');
            fireEvent.click(calculateFxButton);

            // Check result
            await waitFor(() => {
                const result = screen.getByText(/f\(1.5\)/);
                expect(result).toBeInTheDocument();
                expect(result.textContent).toMatch(/f\(1.5\) : 3\.000000/);
            });
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid inputs gracefully', async () => {
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            // Set invalid inputs
            fireEvent.change(xInputs[0], { target: { value: 'invalid' } });
            fireEvent.change(fxInputs[0], { target: { value: 'invalid' } });

            const calculateButton = screen.getByText('Calculate Linear Regression');
            fireEvent.click(calculateButton);

        
        });
    });
});
