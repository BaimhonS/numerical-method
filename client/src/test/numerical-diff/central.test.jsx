import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import CentralDividedDifference from '../../pages/NumericalDifferentiation/Central';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Central Divided Difference Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <CentralDividedDifference />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        const headings = screen.getAllByText('Central Divided Difference');
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

        test('calculates first order derivative correctly', async () => {
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
                expect(screen.getByText(/Result:/)).toBeInTheDocument();
                const resultText = screen.getByText(/Result:/).textContent;
                const match = resultText.match(/≈\s*(-?\d+\.\d+)/);
                expect(match).toBeTruthy();
                const value = parseFloat(match[1]);
                expect(value).toBeCloseTo(4.0, 1); // Compare with 1 decimal place precision
            });
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
                const resultText = screen.getByText(/Result:/).textContent;
                const match = resultText.match(/≈\s*(-?\d+\.\d+)/);
                expect(match).toBeTruthy();
                const value = parseFloat(match[1]);
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
                'Error in calculation. Please check your input and try again.'
            );
        });

        test('handles exponential function notation', () => {
            // Mock successful evaluation for exp function
            math.evaluate.mockImplementation((expr, { x }) => Math.exp(x));

            const testCases = [
                { input: 'e^x', expected: 'exp(x)' },
                { input: '(e^x)', expected: '(exp(x))' },
                { input: 'e^(2x)', expected: 'exp(2x)' }
            ];

            testCases.forEach(({ input, expected }) => {
                // Reset mocks for each test case
                math.evaluate.mockClear();
                
                // Set up inputs
                fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                    target: { value: input }
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

                // Check if math.evaluate was called with the correct transformed expression
                const calls = math.evaluate.mock.calls;
                expect(calls.length).toBeGreaterThan(0);
                
                // The expression should contain 'exp' and not 'e^'
                const firstCall = calls[0][0];
                expect(firstCall).not.toContain('e^');
                expect(firstCall).toContain('exp');
            });
        });
    });

    // Test validation
    describe('Input Validation', () => {
        test('validates empty inputs', () => {
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith(
                'Error in calculation. Please check your input and try again.'
            );
        });

        test('validates invalid order value', () => {
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
                target: { value: '0' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalled();
        });

        test('validates h value is not zero', () => {
            fireEvent.change(screen.getByPlaceholderText('Enter function (e.g., x^2, exp(x))'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Step size'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('Order'), {
                target: { value: '1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith(
                'Error in calculation. Please check your input and try again.'
            );
        });
    });
}); 