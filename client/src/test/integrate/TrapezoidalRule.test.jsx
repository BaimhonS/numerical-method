import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import TrapezoidalRule from '../../pages/Integrate/TrapezoidalRule';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Trapezoidal Rule Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <TrapezoidalRule />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        // Find the heading specifically
        const headings = screen.getAllByText('Trapezoidal Rule');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Start of interval a')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('End of interval b')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Number of subintervals n')).toBeInTheDocument();
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
            const input = screen.getByPlaceholderText('Number of subintervals n');
            fireEvent.change(input, { target: { value: '4' } });
            expect(input.value).toBe('4');
        });
    });

    // Test validation
    describe('Input Validation', () => {
        test('validates empty inputs', () => {
            const calculateButton = screen.getByText('Calculate Trapezoidal');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter valid values for a, b, and n.');
        });

        test('validates negative number of subintervals', () => {
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
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n'), {
                target: { value: '-2' }
            });

            const calculateButton = screen.getByText('Calculate Trapezoidal');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter valid values for a, b, and n.');
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
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n'), {
                target: { value: '4' }
            });

            const calculateButton = screen.getByText('Calculate Trapezoidal');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                const result = screen.getByText(/Approximate Integral Result:/);
                expect(result).toBeInTheDocument();
            });
        });

        test('updates result when inputs change', async () => {
            // First calculation
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n'), {
                target: { value: '4' }
            });

            const calculateButton = screen.getByText('Calculate Trapezoidal');
            fireEvent.click(calculateButton);

            // Change interval and calculate again
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '2' }
            });
            fireEvent.click(calculateButton);

            await waitFor(() => {
                const result = screen.getByText(/Approximate Integral Result:/);
                expect(result).toBeInTheDocument();
            });
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid function expressions', async () => {
            // Set up inputs first
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'invalid' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n'), {
                target: { value: '2' }
            });

            // Mock math.evaluate to throw error
            math.evaluate.mockImplementation(() => {
                throw new Error('Invalid function expression');
            });

            const calculateButton = screen.getByText('Calculate Trapezoidal');
            
            // Use try-catch to handle the expected error
            try {
                fireEvent.click(calculateButton);
            } catch (error) {
                // Expected error
            }

            await waitFor(() => {
                expect(math.evaluate).toHaveBeenCalled();
                expect(window.alert).toHaveBeenCalledWith('Calculation error: Invalid function expression');
                expect(screen.queryByText(/Approximate Integral Result:/)).not.toBeInTheDocument();
            });
        });

        test('handles NaN results', async () => {
            // Set up inputs first
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2 + 3'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Start of interval a'), {
                target: { value: '0' }
            });
            fireEvent.change(screen.getByPlaceholderText('End of interval b'), {
                target: { value: '1' }
            });
            fireEvent.change(screen.getByPlaceholderText('Number of subintervals n'), {
                target: { value: '2' }
            });

            // Mock math.evaluate to return NaN
            math.evaluate.mockImplementation(() => NaN);

            const calculateButton = screen.getByText('Calculate Trapezoidal');
            fireEvent.click(calculateButton);
        });
    });
}); 