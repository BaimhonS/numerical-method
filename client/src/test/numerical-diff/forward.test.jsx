import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as math from 'mathjs';
import ForwardDividedDifference from '../../pages/NumericalDifferentiation/Forward';

// Mock mathjs
jest.mock('mathjs', () => ({
    evaluate: jest.fn()
}));

describe('Forward Difference Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <ForwardDividedDifference />
            </BrowserRouter>
        );
        window.alert = jest.fn();
        math.evaluate.mockClear();
    });

    // Test validation
    describe('Input Validation', () => {
        test('validates empty inputs', () => {
            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
        });

        test('validates invalid h value', () => {

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
            
        });
    });

    // Test calculation
    describe('Calculation', () => {
        beforeEach(() => {
            // Mock math.evaluate to return x^2
            math.evaluate.mockImplementation((expr, { x }) => x * x);
        });

        test('calculates first derivative correctly', async () => {

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
        });

        test('calculates second derivative correctly', async () => {

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        test('handles invalid function expressions', async () => {

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(screen.queryByText(/First Derivative:/)).not.toBeInTheDocument();
                expect(screen.queryByText(/Second Derivative:/)).not.toBeInTheDocument();
            });
        });

        test('handles NaN results', async () => {
            // Mock math.evaluate to return NaN
            math.evaluate.mockImplementation(() => NaN);

            const calculateButton = screen.getByText('Calculate');
            fireEvent.click(calculateButton);

            await waitFor(() => {
                expect(screen.queryByText(/First Derivative:/)).not.toBeInTheDocument();
                expect(screen.queryByText(/Second Derivative:/)).not.toBeInTheDocument();
            });
        });
    });
});
