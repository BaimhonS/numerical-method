import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinearInterpolation from '../../pages/Interpolation/LinearNewton';

// Mock window.alert
window.alert = jest.fn();

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
    return function DummySidebar() {
        return <div data-testid="sidebar">Sidebar</div>;
    };
});

describe('Linear Interpolation Component', () => {
    beforeEach(() => {
        render(<LinearInterpolation />);
        jest.clearAllMocks();
    });

    // Test component rendering
    test('renders LinearInterpolation component', () => {
        expect(screen.getByText('Linear Interpolation')).toBeInTheDocument();
    });

    // Test adding points
    test('adds new point when Add Point button is clicked', () => {
        const addButton = screen.getByText('Add Point');
        const initialPoints = screen.getAllByText(/Point \d+:/);
        
        fireEvent.click(addButton);
        
        const newPoints = screen.getAllByText(/Point \d+:/);
        expect(newPoints.length).toBe(initialPoints.length + 1);
    });

    // Test removing points
    test('removes point when Remove button is clicked', async () => {
        // First add a point
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        await waitFor(() => {
            // Find all remove buttons
            const removeButtons = screen.getAllByText('Remove');
            expect(removeButtons.length).toBeGreaterThan(0);
            
            // Click the last remove button
            fireEvent.click(removeButtons[removeButtons.length - 1]);
        });

        // Check points after removal
        const points = screen.getAllByText(/Point \d+:/);
        expect(points.length).toBe(1); // Should be back to 1 point
    });

    // Test input validation
    test('validates point inputs', () => {
        const xInput = screen.getAllByPlaceholderText('x')[0];
        const fxInput = screen.getAllByPlaceholderText('f(x)')[0];
        const calculateButton = screen.getByText('Calculate');

        // Test with invalid inputs
        fireEvent.change(xInput, { target: { value: '' } });
        fireEvent.change(fxInput, { target: { value: '' } });
        fireEvent.click(calculateButton);

        // Should not calculate with empty inputs
        expect(screen.queryByText(/Interpolated y value:/)).not.toBeInTheDocument();
    });

    // Test calculation
    test('calculates linear interpolation correctly', async () => {
        // Set up points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        
        await waitFor(() => {
            // Point 1
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '2' } });
        });

        // Add second point
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        await waitFor(() => {
            const newXInputs = screen.getAllByPlaceholderText('x');
            const newFxInputs = screen.getAllByPlaceholderText('f(x)');
            
            // Point 2
            fireEvent.change(newXInputs[1], { target: { value: '3' } });
            fireEvent.change(newFxInputs[1], { target: { value: '4' } });

            // Set point selections
            const point1Input = screen.getByPlaceholderText('Point 1 index');
            const point2Input = screen.getByPlaceholderText('Point 2 index');
            fireEvent.change(point1Input, { target: { value: '1' } });
            fireEvent.change(point2Input, { target: { value: '2' } });

            // Set x value
            const xValueInput = screen.getByPlaceholderText('x value');
            fireEvent.change(xValueInput, { target: { value: '2' } });
        });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Wait for result
        await waitFor(() => {
            const result = screen.getByText(/Interpolated y value:/);
            expect(result).toBeInTheDocument();
            expect(result).toHaveTextContent('3.000000');
        });
    });

    // Test point selection
    test('allows selection of points for interpolation', () => {
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');

        fireEvent.change(point1Input, { target: { value: '1' } });
        fireEvent.change(point2Input, { target: { value: '2' } });

        expect(point1Input.value).toBe('1');
        expect(point2Input.value).toBe('2');
    });

    // Test edge cases
    test('handles edge cases', () => {
        // Test with same points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });
        
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        
        const newXInputs = screen.getAllByPlaceholderText('x');
        const newFxInputs = screen.getAllByPlaceholderText('f(x)');
        fireEvent.change(newXInputs[1], { target: { value: '1' } });
        fireEvent.change(newFxInputs[1], { target: { value: '1' } });

        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1' } });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Should still show a result
        expect(screen.getByText(/Interpolated y value:/)).toBeInTheDocument();
    });

    // Test UI interactions
    test('updates UI state correctly', async () => {
        // Add multiple points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Check if points were added
        expect(screen.getAllByText(/Point \d+:/).length).toBe(3);

        // Remove a point
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        // Check if point was removed
        expect(screen.getAllByText(/Point \d+:/).length).toBe(2);
    });

    it('handles validation errors correctly', async () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
        });
    });
});
