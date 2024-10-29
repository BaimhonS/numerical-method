import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Bisection from './Bisection';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('Bisection Component', () => {
    test('fetches example input and sets state correctly', async () => {
        const mockData = { data: { equation: 'x^2 - 4', xl: 1, xr: 3, e: 0.001 } };
        axios.get.mockResolvedValue(mockData);

        render(<Bisection />);

        fireEvent.click(screen.getByText(/Get Example Input/i));

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Equation/i).value).toBe('x^2 - 4');
            expect(screen.getByPlaceholderText(/Xl/i).value).toBe('1');
            expect(screen.getByPlaceholderText(/Xr/i).value).toBe('3');
            expect(screen.getByPlaceholderText(/Error/i).value).toBe('0.001');
        });
    });

    test('calculates bisection method and displays results', async () => {
        render(<Bisection />);

        fireEvent.change(screen.getByPlaceholderText(/Equation/i), { target: { value: 'x^3 - x - 2' } });
        fireEvent.change(screen.getByPlaceholderText(/Xl/i), { target: { value: 1 } });
        fireEvent.change(screen.getByPlaceholderText(/Xr/i), { target: { value: 2 } });
        fireEvent.change(screen.getByPlaceholderText(/Error/i), { target: { value: 0.01 } });

        fireEvent.click(screen.getByText(/Calculate/i));

        await waitFor(() => {
            expect(screen.getByText(/X : /i)).toBeInTheDocument();
            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getAllByRole('row').length).toBeGreaterThan(1); // Check if there are rows in the table
        });
    });
});
