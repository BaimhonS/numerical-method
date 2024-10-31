import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import SimpsonRule from '../../pages/Integrate/SimpsonRule';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Simpson Rule Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <SimpsonRule />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        expect(screen.getByText("Simpson's Rule")).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Start of interval a')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('End of interval b')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Number of subintervals n (even)')).toBeInTheDocument();
    });

    // Test input handling
    describe('Input Handling', () => {
        test('updates function input correctly', () => {
            const input = screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3');
            fireEvent.change(input, { target: { value: 'x^2' } });
            expect(input.value).toBe('x^2');
        });

        test('updates interval inputs correctly', () => {
            const startInput = screen.getByPlaceholderText('Start of interval a');
            const endInput = screen.getByPlaceholderText('End of interval b');
            
            fireEvent.change(startInput, { target: { value: '0' } });
            fireEvent.change(endInput, { target: { value: '1' } });
            
            expect(startInput.value).toBe('0');
            expect(endInput.value).toBe('1');
        });

        test('updates subintervals input correctly', () => {
            const input = screen.getByPlaceholderText('Number of subintervals n (even)');
            fireEvent.change(input, { target: { value: '4' } });
            expect(input.value).toBe('4');
        });
    });

    // Test validation
    describe('Input Validation', () => {
        test('validates empty inputs', () => {
            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter valid values for a, b, and an even n.');
        });

        test('validates odd number of subintervals', () => {
            // Fill inputs with valid values except n
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n (even)'), {
                target: { value: '3' }
            });

            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter valid values for a, b, and an even n.');
        });

        test('validates negative number of subintervals', () => {
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n (even)'), {
                target: { value: '-2' }
            });

            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter valid values for a, b, and an even n.');
        });
    });

    // Test calculation
    describe('Calculation', () => {
        beforeEach(() => {
            // Mock math.evaluate to return x^2
            math.evaluate.mockImplementation((_, { x }) => x * x);
        });

        test('calculates integral correctly', async () => {
            // Set up inputs for x^2 from 0 to 1 with 4 subintervals
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n (even)'), {
                target: { value: '4' }
            });

            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);

            await waitFor(() => {
                const result = screen.getByText(/Approximate Integral Result:/);
                expect(result).toBeInTheDocument();
                // The actual value should be close to 0.333333 (1/3)
                expect(result.textContent).toMatch(/0\.33/);
            });
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid function expressions', async () => {
            // Set up inputs
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'invalid' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n (even)'), {
                target: { value: '2' }
            });

            // Mock math.evaluate to throw error
            math.evaluate.mockImplementation(() => {
                throw new Error('Invalid function expression');
            });

            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);
        });

        test('handles calculation errors', async () => {
            // Mock math.evaluate to return NaN
            math.evaluate.mockImplementation(() => NaN);

            // Set up inputs
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n (even)'), {
                target: { value: '2' }
            });

            const calculateButton = screen.getByText("Calculate Simpson's Rule");
            fireEvent.click(calculateButton);
        });
    });
});
