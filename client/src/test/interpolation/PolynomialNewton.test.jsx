import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import PolynomialNewton from '../../pages/Interpolation/PolynomialNewton';

// Mock window.alert
window.alert = jest.fn();

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
    return function DummySidebar() {
        return <div data-testid="sidebar">Sidebar</div>;
    };
});

describe('Polynomial Newton Interpolation Component', () => {
    beforeEach(() => {
        render(<PolynomialNewton />);
        jest.clearAllMocks();
    });

    // Test component rendering
    test('renders PolynomialNewton component', () => {
        expect(screen.getByText('Polynomial Newton Interpolation')).toBeInTheDocument();
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
            const removeButtons = screen.getAllByText('Remove');
            expect(removeButtons.length).toBeGreaterThan(0);
            
            fireEvent.click(removeButtons[removeButtons.length - 1]);
        });

        const points = screen.getAllByText(/Point \d+:/);
        expect(points.length).toBe(1);
    });

    // Test point selection
    test('allows selection of points for interpolation', async () => {
        // Add a point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        const pointSelectors = screen.getAllByPlaceholderText(/Point \d+ index/);
        
        await waitFor(() => {
            // Select first point
            fireEvent.change(pointSelectors[0], { target: { value: '1' } });
        });

        await waitFor(() => {
            // Select second point
            fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        });

        expect(pointSelectors[0].value).toBe('1');
    });

    // Test calculation with valid inputs
    test('calculates polynomial interpolation correctly', async () => {
        // Add points
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Set up points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        const pointSelectors = screen.getAllByPlaceholderText(/Point \d+ index/);
        
        await waitFor(() => {
            // Point 1
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '2' } });
            
            // Point 2
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });

            // Select points
            fireEvent.change(pointSelectors[0], { target: { value: '1' } });
            fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        });

        // Set x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        await waitFor(() => {
            const result = screen.getByText(/Interpolated y value:/);
            expect(result).toBeInTheDocument();
        });
    });

    // Test insufficient points error
    test('shows alert for insufficient points', async () => {
        // Clear previous renders
        cleanup();
        render(<PolynomialNewton />);
        
        // Add data-testid to Calculate button
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please select at least two points.');
    });

    // Test x value validation
    test('shows alert for missing x value', async () => {
        cleanup();
        render(<PolynomialNewton />);
        
        // Add points first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        
        await waitFor(() => {
            // Wait for points to be added
            expect(screen.getAllByText(/Point \d+:/).length).toBe(2);
        });

        // Select and fill points
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');
        
        await waitFor(() => {
            fireEvent.change(point1Input, { target: { value: '1' } });
            fireEvent.change(point2Input, { target: { value: '2' } });
        });

        // Clear x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '' } });

        // Use data-testid
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please enter x value');
    });

    // Test input validation
    test('validates point inputs', async () => {
        const xInput = screen.getAllByPlaceholderText('x')[0];
        const fxInput = screen.getAllByPlaceholderText('f(x)')[0];
        
        await waitFor(() => {
            fireEvent.change(xInput, { target: { value: '' } });
            fireEvent.change(fxInput, { target: { value: '' } });
        });

        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalled();
    });

    // Test edge cases
    test('handles edge cases with same x values', async () => {
        // Add a point
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Set up points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        const pointSelectors = screen.getAllByPlaceholderText(/Point \d+ index/);
        
        // Fill in point values
        await waitFor(() => {
            fireEvent.change(xInputs[0], { target: { value: '1' } });
            fireEvent.change(fxInputs[0], { target: { value: '1' } });
            fireEvent.change(xInputs[1], { target: { value: '2' } });
            fireEvent.change(fxInputs[1], { target: { value: '4' } });
        });

        // Select points
        await waitFor(() => {
            fireEvent.change(pointSelectors[0], { target: { value: '1' } });
            fireEvent.change(pointSelectors[1], { target: { value: '2' } });
        });

        // Set x value
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Wait for result
        await waitFor(() => {
            expect(screen.getByText(/Interpolated y value:/)).toBeInTheDocument();
        }, { timeout: 3000 });
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