import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import BackwardDividedDifference from '../../pages/NumericalDifferentiation/Backward';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Backward Divided Difference Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <BackwardDividedDifference />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        const headings = screen.getAllByText('Backward Divided Difference');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('x value')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Step size')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Order')).toBeInTheDocument();
    });

    // Test input handling
    describe('Input Handling', () => {
        test('updates function input correctly', () => {
            const input = screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))');
            fireEvent.change(input, { target: { value: 'x^2' } });
            expect(input.value).toBe('x^2');
        });

        test('updates x value input correctly', () => {
            const input = screen.getByPlaceholderText('x value');
            fireEvent.change(input, { target: { value: '2' } });
            expect(input.value).toBe('2');
        });

        test('updates h value input correctly', () => {
            const input = screen.getByPlaceholderText('Step size');
            fireEvent.change(input, { target: { value: '0.1' } });
            expect(input.value).toBe('0.1');
        });

        test('updates order input correctly', () => {
            const input = screen.getByPlaceholderText('Order');
            fireEvent.change(input, { target: { value: '1' } });
            expect(input.value).toBe('1');
        });
    });

    // Test calculation
    describe('Calculation', () => {
        beforeEach(() => {
            // Mock math.evaluate to return x^2
            math.evaluate.mockImplementation((expr, { x }) => x * x);
        });

        test('calculates backward difference correctly', async () => {
            // Set up test inputs
            const functionInput = screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))');
            const xInput = screen.getByPlaceholderText('x value');
            const hInput = screen.getByPlaceholderText('Step size');
            const orderInput = screen.getByPlaceholderText('Order');

            // Fill in test values
            fireEvent.change(functionInput, { target: { value: 'x^2' } });
            fireEvent.change(xInput, { target: { value: '2' } });
            fireEvent.change(hInput, { target: { value: '0.1' } });
            fireEvent.change(orderInput, { target: { value: '1' } });

            // Click calculate
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            // Check result - allow for numerical approximation
            await waitFor(() => {
                const resultText = screen.getByText(/Result:/).textContent;
                expect(resultText).toMatch(/3\.9/); // Accept 3.9 as it's close to the expected 4.0
                
                // Verify table is populated
                expect(screen.getByText('2.0000')).toBeInTheDocument();
                expect(screen.getByText('1.9000')).toBeInTheDocument();
            });
        });

        test('handles invalid expressions gracefully', async () => {
            // Set up test inputs with invalid expression
            const functionInput = screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))');
            const xInput = screen.getByPlaceholderText('x value');
            
            fireEvent.change(functionInput, { target: { value: 'invalid++' } });
            fireEvent.change(xInput, { target: { value: '2' } });

            // Click calculate
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
        });

        test('calculates higher order derivative correctly', async () => {
            // Set up inputs for second order derivative
            fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Step size'), {
                target: { value: '0.1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Order'), {
                target: { value: '2' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(screen.getByText(/Result:/)).toBeInTheDocument();
                // For f(x) = x^2, f''(x) = 2
                const resultText = screen.getByText(/Result:/).textContent;
                expect(resultText).toMatch(/2\.0/);
            });
        });

        test('displays calculation steps', async () => {
            // Set up inputs
            fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Step size'), {
                target: { value: '0.1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Order'), {
                target: { value: '1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(screen.getByText('Step')).toBeInTheDocument();
                expect(screen.getByText('x Value')).toBeInTheDocument();
                expect(screen.getByText('f(x)')).toBeInTheDocument();
            });
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid function expressions', async () => {
            math.evaluate.mockImplementation(() => {
                throw new Error('Invalid expression');
            });

            // Set up inputs
            fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                target: { value: 'invalid' }
            });
            fireEvent.change(screen.getByPlaceholderText('x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Step size'), {
                target: { value: '0.1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Order'), {
                target: { value: '1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(window.alert).toHaveBeenCalledWith(
                "Error in calculation. Please use 'exp(x)' for exponential function."
            );
        });

        test('handles exponential function notation', async () => {
            // Test the replacement of e^x with exp(x)
            fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                target: { value: 'e^x' }
            });
            fireEvent.change(screen.getByPlaceholderText('x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Step size'), {
                target: { value: '0.1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Order'), {
                target: { value: '1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(math.evaluate).toHaveBeenCalled();
            // Verify that e^x was replaced with exp(x) in the evaluation
            expect(math.evaluate.mock.calls[0][0]).toContain('exp(x)');
        });
    });
}); 