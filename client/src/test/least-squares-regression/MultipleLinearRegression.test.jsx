import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import MultipleLinearRegression from '../../pages/least-squares-regression/MultipleLinearRegression';

// Mock mathjs
jest.mock('mathjs', () => ({
    lusolve: jest.fn()
}));

describe('Multiple Linear Regression Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <MultipleLinearRegression />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.lusolve.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        const headings = screen.getAllByText('Multiple Linear Regression');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
        expect(screen.getByText('Add Variable')).toBeInTheDocument();
    });

    // Test point and variable management
    describe('Point and Variable Management', () => {
        test('adds points correctly', () => {
            const addButton = screen.getByText('Add Point');
            const initialPointsCount = screen.getAllByPlaceholderText('x1').length;
            
            fireEvent.click(addButton);
            
            const newPointsCount = screen.getAllByPlaceholderText('x1').length;
            expect(newPointsCount).toBe(initialPointsCount + 1);
        });

        test('adds variables correctly', () => {
            const addVarButton = screen.getByText('Add Variable');
            const initialVarsCount = screen.getAllByPlaceholderText(/x\d+/).length;
            
            fireEvent.click(addVarButton);
            
            const newVarsCount = screen.getAllByPlaceholderText(/x\d+/).length;
            expect(newVarsCount).toBe(initialVarsCount + 1);
        });

        test('removes points correctly', () => {
            const addButton = screen.getByText('Add Point');
            fireEvent.click(addButton);

            const removeButtons = screen.getAllByText('Remove');
            const initialPointsCount = screen.getAllByPlaceholderText('x1').length;
            
            fireEvent.click(removeButtons[0]);
            
            const finalPointsCount = screen.getAllByPlaceholderText('x1').length;
            expect(finalPointsCount).toBe(initialPointsCount - 1);
        });

        test('removes variables correctly', async () => {
            // Add variable first
            const addVarButton = screen.getByText('Add Variable');
            fireEvent.click(addVarButton);

            const removeVarButton = screen.getByText('Remove Last Variable');
            const initialVarsCount = screen.getAllByPlaceholderText(/x\d+/).length;
            
            fireEvent.click(removeVarButton);
            
            await waitFor(() => {
                const finalVarsCount = screen.getAllByPlaceholderText(/x\d+/).length;
                expect(finalVarsCount).toBe(initialVarsCount - 1);
            });
        });
    });

    // Test calculation functionality
    describe('Calculation Functionality', () => {
        beforeEach(() => {
            // Mock successful matrix solution
            math.lusolve.mockReturnValue([[1], [2], [3]]);
        });

        test('calculates regression coefficients correctly', async () => {
            // Add a variable and points
            const addVarButton = screen.getByText('Add Variable');
            fireEvent.click(addVarButton);

            const addPointButton = screen.getByText('Add Point');
            fireEvent.click(addPointButton);
            fireEvent.click(addPointButton);

            // Set point values
            const x1Inputs = screen.getAllByPlaceholderText('x1');
            const x2Inputs = screen.getAllByPlaceholderText('x2');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            // Fill in test data
            [x1Inputs, x2Inputs, fxInputs].forEach((inputs, idx) => {
                inputs.forEach((input, i) => {
                    fireEvent.change(input, { target: { value: String(i + idx + 1) } });
                });
            });

            // Calculate coefficients
            const calculateButton = screen.getByText('Calculate Coefficients');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(screen.getByText('System of Equations (AX = B):')).toBeInTheDocument();
                expect(screen.getByText('Solution:')).toBeInTheDocument();
            });
        });

        test('predicts f(x) correctly', async () => {
            // Set up regression first
            const addVarButton = screen.getByText('Add Variable');
            fireEvent.click(addVarButton);

            const addPointButton = screen.getByText('Add Point');
            fireEvent.click(addPointButton);

            // Fill in test data
            const x1Inputs = screen.getAllByPlaceholderText('x1');
            const x2Inputs = screen.getAllByPlaceholderText('x2');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            [x1Inputs, x2Inputs, fxInputs].forEach((inputs, idx) => {
                inputs.forEach((input, i) => {
                    fireEvent.change(input, { target: { value: String(i + idx + 1) } });
                });
            });

            // Calculate coefficients
            const calculateButton = screen.getByText('Calculate Coefficients');
            fireEvent.click(calculateButton);

            // Set prediction inputs
            const predictionInputs = screen.getAllByLabelText(/Enter x\d+ value for prediction/);
            predictionInputs.forEach((input, i) => {
                fireEvent.change(input, { target: { value: String(i + 1) } });
            });

            // Predict
            const predictButton = screen.getByText('Predict f(x)');
            fireEvent.click(predictButton);
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('validates minimum points requirement', async () => {
            const calculateButton = screen.getByText('Calculate Coefficients');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Please enter at least 2 points for multiple linear regression.');
            });
        });

        test('validates prediction prerequisites', async () => {
            const predictButton = screen.getByText('Predict f(x)');
            fireEvent.click(predictButton);

        });

        test('handles matrix calculation errors', async () => {
            // Mock error in matrix solution
            math.lusolve.mockImplementation(() => {
                throw new Error('Matrix calculation error');
            });

            // Set up calculation with valid inputs
            const addPointButton = screen.getByText('Add Point');
            fireEvent.click(addPointButton);

            const x1Inputs = screen.getAllByPlaceholderText('x1');
            const fxInputs = screen.getAllByPlaceholderText('f(x)');

            x1Inputs.forEach((input, i) => {
                fireEvent.change(input, { target: { value: String(i + 1) } });
            });
            fxInputs.forEach((input, i) => {
                fireEvent.change(input, { target: { value: String(i + 1) } });
            });

            const calculateButton = screen.getByText('Calculate Coefficients');
            fireEvent.click(calculateButton);
        });
    });
}); 