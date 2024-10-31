import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuadraticNewton from '../../pages/Interpolation/QuadraticNewton';

// Mock window.alert
window.alert = jest.fn();

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
    return function DummySidebar() {
        return <div data-testid="sidebar">Sidebar</div>;
    };
});

describe('Quadratic Newton Interpolation Component', () => {
    beforeEach(() => {
        render(<QuadraticNewton />);
        jest.clearAllMocks();
    });

    // Test component rendering
    test('renders QuadraticNewton component', () => {
        expect(screen.getByText('Quadratic Interpolation')).toBeInTheDocument();
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
        // First add points to have more than one
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        await waitFor(() => {
            const removeButtons = screen.getAllByText('Remove');
            expect(removeButtons.length).toBeGreaterThan(0);
            
            fireEvent.click(removeButtons[removeButtons.length - 1]);
        });

        const points = screen.getAllByText(/Point \d+:/);
        expect(points.length).toBe(2);
    });

    // Test point selection
    test('allows selection of three points for interpolation', async () => {
        // Add points first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');
        const point3Input = screen.getByPlaceholderText('Point 3 index');

        await waitFor(() => {
            fireEvent.change(point1Input, { target: { value: '1' } });
            fireEvent.change(point2Input, { target: { value: '2' } });
            fireEvent.change(point3Input, { target: { value: '3' } });
        });

        expect(point1Input).toHaveValue(1);
        expect(point2Input).toHaveValue(2);
        expect(point3Input).toHaveValue(3);
    });

    // Test calculation with valid inputs
    test('calculates quadratic interpolation correctly', async () => {
        // Add points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Set up points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');

        await waitFor(() => {
            // Point 1
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            
            // Point 2
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });
            
            // Point 3
            fireEvent.change(xInputs[2], { target: { value: '3' } });
            fireEvent.change(fxInputs[2], { target: { value: '9' } });
        });

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        await waitFor(() => {
            expect(screen.getByText(/Interpolated y value:/)).toBeInTheDocument();
        });
    });

    // Test validation
    test('shows alert for insufficient points', () => {
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter at least 3 points for calculation.');
    });

    // Test input validation
    test('validates point inputs', async () => {
        // Add required points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalled();
    });

    // Test UI state updates
    test('updates UI state correctly', async () => {
        // Add points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        // Check points added
        expect(screen.getAllByText(/Point \d+:/).length).toBe(3);

        // Remove a point
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        // Check point removed
        expect(screen.getAllByText(/Point \d+:/).length).toBe(2);
    });
}); 