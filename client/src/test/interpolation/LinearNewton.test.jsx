import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
        render(
            <BrowserRouter>
                <LinearInterpolation />
            </BrowserRouter>
        );
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
        // Add a second point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);

        // Set up test data
        const points = [
            { x: '1', fx: '2' },
            { x: '3', fx: '4' }
        ];

        // Fill in the points
        points.forEach((point, index) => {
            fireEvent.change(screen.getByTestId(`x-input-${index}`), {
                target: { value: point.x }
            });
            fireEvent.change(screen.getByTestId(`fx-input-${index}`), {
                target: { value: point.fx }
            });
        });

        // Set x value
        fireEvent.change(screen.getByTestId('x-value-input'), {
            target: { value: '2' }
        });

        // Click calculate
        fireEvent.click(screen.getByText('Calculate'));

        // Wait for and check the result
        await waitFor(() => {
            const resultElement = screen.getByTestId('interpolation-result');
            expect(resultElement).toBeInTheDocument();
            expect(resultElement).toHaveTextContent('3.000000');
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
    test('handles edge cases', async () => {
        // Add a second point first
        const addButton = screen.getByText('Add Point');
        fireEvent.click(addButton);
        
        await waitFor(() => {
            expect(screen.getByTestId('x-input-1')).toBeInTheDocument();
        });

        // Set up test data with slightly different values
        const points = [
            { x: '1', fx: '2' },
            { x: '2', fx: '2' }  // Different x value, same y value
        ];

        // Fill in the points
        for (let index = 0; index < points.length; index++) {
            fireEvent.change(screen.getByTestId(`x-input-${index}`), {
                target: { value: points[index].x }
            });
            fireEvent.change(screen.getByTestId(`fx-input-${index}`), {
                target: { value: points[index].fx }
            });
        }

        // Set x value for interpolation
        fireEvent.change(screen.getByTestId('x-value-input'), {
            target: { value: '1.5' }
        });

        // Click calculate
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);

        // Wait for and check the result
        await waitFor(() => {
            const resultElement = screen.getByTestId('interpolation-result');
            expect(resultElement).toBeInTheDocument();
            expect(resultElement.textContent).toMatch(/Interpolated y value:\s*2\.0{1,6}/);
        }, { timeout: 2000 });
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
        // Try to calculate without filling in any values
        fireEvent.click(screen.getByText('Calculate'));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
        });
    });

    // Remove or update the 'renders initial form correctly' test since the interface has changed
    test('renders initial form elements correctly', () => {
        expect(screen.getByText('Linear Interpolation')).toBeInTheDocument();
        expect(screen.getByText('Add Point')).toBeInTheDocument();
        expect(screen.getByTestId('x-value-input')).toBeInTheDocument();
        expect(screen.getByText('Calculate')).toBeInTheDocument();
    });
});
