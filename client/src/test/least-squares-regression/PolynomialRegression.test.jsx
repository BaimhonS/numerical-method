import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PolynomialRegression from '../../pages/least-squares-regression/PolynomialRegression';

describe('Polynomial Regression Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <PolynomialRegression />
            </BrowserRouter>
        );
        window.alert = jest.fn();
    });

    // Test initial render
    test('renders component correctly', () => {
        const headings = screen.getAllByText('Polynomial Regression');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        expect(screen.getByText('Enter Points Data')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
        expect(screen.getByText('Order M')).toBeInTheDocument();
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
            expect(removeButtons.length).toBe(0);
        });
    });

    // Test input validation
    describe('Input Validation', () => {
        test('validates minimum points requirement for degree', async () => {
            // Set degree
            const degreeInput = screen.getByLabelText('Order M');
            fireEvent.change(degreeInput, { target: { value: '2' } });

            const calculateButton = screen.getByText('Calculate Polynomial Regression');
            fireEvent.click(calculateButton);
            
            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for degree 2 regression.');
            });
        });

        test('validates estimation requirement', () => {
            const estimateButton = screen.getByText('Estimate f(x)');
            fireEvent.click(estimateButton);
            expect(screen.queryByText(/f\(\d+(\.\d+)?\) =/)).not.toBeInTheDocument();
        });
    });

    // Test calculation functionality
    describe('Calculation Functionality', () => {
        test('calculates polynomial regression correctly', async () => {
            // Set degree
            const degreeInput = screen.getByLabelText('Order M');
            fireEvent.change(degreeInput, { target: { value: '1' } });

            // Add points
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

            // Calculate regression
            const calculateButton = screen.getByText('Calculate Polynomial Regression');
            fireEvent.click(calculateButton);

            // Check if coefficients are displayed
            await waitFor(() => {
                const coefficients = screen.getByText(/Polynomial Coefficients:/);
                expect(coefficients).toBeInTheDocument();
            });
        });

        test('estimates f(x) correctly', async () => {
            // Set up regression first
            const degreeInput = screen.getByLabelText('Order M');
            fireEvent.change(degreeInput, { target: { value: '1' } });

            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            const calculateButton = screen.getByText('Calculate Polynomial Regression');
            fireEvent.click(calculateButton);

            // Estimate f(x)
            const xValueInput = screen.getByLabelText('Enter x value for estimation');
            fireEvent.change(xValueInput, { target: { value: '1.5' } });

            const estimateButton = screen.getByText('Estimate f(x)');
            fireEvent.click(estimateButton);

            await waitFor(() => {
                const result = screen.getByText(/f\(1\.5\)/);
                expect(result).toBeInTheDocument();
            });
        });
    });

    // Test matrix display
    describe('Matrix Display', () => {
        test('displays matrices after calculation', async () => {
            // Set up and calculate regression
            const degreeInput = screen.getByLabelText('Order M');
            fireEvent.change(degreeInput, { target: { value: '1' } });

            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const xInputs = screen.getAllByPlaceholderText('x');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            const calculateButton = screen.getByText('Calculate Polynomial Regression');
            fireEvent.click(calculateButton);

        });
    });
}); 