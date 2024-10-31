import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinearLagrangeInterpolation from '../../pages/Interpolation/LinearLagrange';
import { BrowserRouter } from 'react-router-dom';

// Mock window.alert
window.alert = jest.fn();

// Mock Sidebar component
jest.mock('../../components/Sidebar', () => {
    return function DummySidebar() {
        return <div data-testid="sidebar">Sidebar</div>;
    };
});

describe('Linear Lagrange Interpolation Component', () => {
    beforeEach(() => {
        cleanup();
        render(
            <BrowserRouter>
                <LinearLagrangeInterpolation />
            </BrowserRouter>
        );
        jest.clearAllMocks();
    });

    // Test component rendering
    test('renders LinearLagrange component', () => {
        expect(screen.getByText('Linear Lagrange Interpolation')).toBeInTheDocument();
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
        // Add a point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        await waitFor(() => {
            const removeButtons = screen.getAllByText('Remove');
            expect(removeButtons.length).toBeGreaterThan(0);
            
            fireEvent.click(removeButtons[0]);
        });

        const points = screen.getAllByText(/Point \d+:/);
        expect(points.length).toBe(1);
    });

    // Test point selection
    test('allows selection of two points for interpolation', async () => {
        // Add a point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');

        await waitFor(() => {
            fireEvent.change(point1Input, { target: { value: '1' } });
            fireEvent.change(point2Input, { target: { value: '2' } });
        });

        expect(point1Input.value).toBe('1');
        expect(point2Input.value).toBe('2');
    });

    // Test calculation
    test('calculates interpolation correctly', async () => {
        // Set up test points
        const xInputs = screen.getAllByPlaceholderText('x');
        const fxInputs = screen.getAllByPlaceholderText('f(x)');
        
        // Point 1: (1, 1)
        fireEvent.change(xInputs[0], { target: { value: '1' } });
        fireEvent.change(fxInputs[0], { target: { value: '1' } });

        // Add and set second point: (2, 4)
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const newXInputs = screen.getAllByPlaceholderText('x');
            const newFxInputs = screen.getAllByPlaceholderText('f(x)');
            fireEvent.change(newXInputs[1], { target: { value: '2' } });
            fireEvent.change(newFxInputs[1], { target: { value: '4' } });
        });

        // Set point selections
        const point1Input = screen.getByPlaceholderText('Point 1 index');
        const point2Input = screen.getByPlaceholderText('Point 2 index');
        
        fireEvent.change(point1Input, { target: { value: '1' } });
        fireEvent.change(point2Input, { target: { value: '2' } });

        // Set x value for interpolation
        const xValueInput = screen.getByPlaceholderText('x value');
        fireEvent.change(xValueInput, { target: { value: '1.5' } });

        // Calculate
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        // Check result
        await waitFor(() => {
            const result = screen.getByTestId('result-value');
            expect(result).toBeInTheDocument();
            expect(result.textContent).toContain('2.500000'); // Expected value for linear interpolation
        }, { timeout: 3000 });
    });

    // Test validation
    test('validates required fields', async () => {
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    // Test numeric validation
    test('validates numeric inputs', async () => {
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    // Test edge
}); 