import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import ForwardDifference from '../../pages/numerical-diff/ForwardDifference';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Forward Difference Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <ForwardDifference />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test initial render
    test('renders component correctly', () => {
        const headings = screen.getAllByText('Forward Divided-Differences');
        const mainHeading = headings.find(element => element.tagName.toLowerCase() === 'h2');
        expect(mainHeading).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Enter a function, e.g., x^2')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter x value')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter h value')).toBeInTheDocument();
    });

    // Test input handling
    describe('Input Handling', () => {
        test('updates function input correctly', () => {
            const input = screen.getByPlaceholderText('Enter a function, e.g., x^2');
            fireEvent.change(input, { target: { value: 'x^2' } });
            expect(input.value).toBe('x^2');
        });

        test('updates x value input correctly', () => {
            const input = screen.getByPlaceholderText('Enter x value');
            fireEvent.change(input, { target: { value: '2' } });
            expect(input.value).toBe('2');
        });

        test('updates h value input correctly', () => {
            const input = screen.getByPlaceholderText('Enter h value');
            fireEvent.change(input, { target: { value: '0.1' } });
            expect(input.value).toBe('0.1');
        });
    });

    // Test validation
    describe('Input Validation', () => {
        test('validates empty inputs', () => {
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('Please enter all values');
        });

        test('validates invalid h value', () => {
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter h value'), {
                target: { value: '0' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
            expect(window.alert).toHaveBeenCalledWith('h value must be non-zero');
        });
    });

    // Test calculation
    describe('Calculation', () => {
        beforeEach(() => {
            // Mock math.evaluate to return x^2
            math.evaluate.mockImplementation((expr, { x }) => x * x);
        });

        test('calculates first derivative correctly', async () => {
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter h value'), {
                target: { value: '0.1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                const result = screen.getByText(/First Derivative:/);
                expect(result).toBeInTheDocument();
                // For f(x) = x^2, f'(2) ≈ 4
                expect(result.textContent).toMatch(/4\.0/);
            });
        });

        test('calculates second derivative correctly', async () => {
            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter h value'), {
                target: { value: '0.1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                const result = screen.getByText(/Second Derivative:/);
                expect(result).toBeInTheDocument();
                // For f(x) = x^2, f''(x) = 2
                expect(result.textContent).toMatch(/2\.0/);
            });
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid function expressions', async () => {
            // Mock math.evaluate to throw error
            math.evaluate.mockImplementation(() => {
                throw new Error('Invalid function expression');
            });

            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2'), {
                target: { value: 'invalid' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter h value'), {
                target: { value: '0.1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Error: Invalid function expression');
                expect(screen.queryByText(/First Derivative:/)).not.toBeInTheDocument();
                expect(screen.queryByText(/Second Derivative:/)).not.toBeInTheDocument();
            });
        });

        test('handles NaN results', async () => {
            // Mock math.evaluate to return NaN
            math.evaluate.mockImplementation(() => NaN);

            fireEvent.change(screen.getByPlaceholderText('Enter a function, e.g., x^2'), {
                target: { value: 'x^2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter x value'), {
                target: { value: '2' }
            });
            fireEvent.change(screen.getByPlaceholderText('Enter h value'), {
                target: { value: '0.1' }
            });

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Error: Invalid result');
                expect(screen.queryByText(/First Derivative:/)).not.toBeInTheDocument();
                expect(screen.queryByText(/Second Derivative:/)).not.toBeInTheDocument();
            });
        });
    });
});
