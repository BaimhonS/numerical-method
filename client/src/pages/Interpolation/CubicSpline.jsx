import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const CubicSpline = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [xValue, setXValue] = useState(0); // Input x value
    const [selectedPoints, setSelectedPoints] = useState([0, 1, 2, 3]); // Selected points indices
    const [result, setResult] = useState(null); // Result of interpolation

    // Function to handle input changes
    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
    };

    // Add new point
    const addPoint = () => {
        setPoints([...points, { x: '', fx: '' }]);
    };

    // Remove a point
    const removePoint = (index) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
    };

    // Sort points based on x value
    const sortPoints = () => {
        const sorted = [...points].sort((a, b) => parseFloat(a.x) - parseFloat(b.x));
        setPoints(sorted);
    };

    const calculateCubicSpline = () => {
        if (!validateInputs()) return;
    
        try {
            const selectedPoints = [point1, point2, point3].sort((a, b) => a - b); // Sort points
            const parsedXValues = xValues.map(parseFloat);
            
            const n = selectedPoints.length; // Number of segments
            const matrixSize = 4 * (n - 1); // 4 equations per segment
            const newMatrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
            const newRHS = Array(matrixSize).fill(0);
            
            let row = 0;
    
            // Fill matrix with f(x) conditions for each segment
            selectedPoints.forEach((pointIndex, i) => {
                if (pointIndex >= points.length || !points[pointIndex]) {
                    throw new Error("Invalid point index");
                }
    
                const xi = parseFloat(points[pointIndex].x);
                const fx = parseFloat(points[pointIndex].fx);
                const nextXi = parseFloat(points[pointIndex + 1].x);
                const nextFx = parseFloat(points[pointIndex + 1].fx);
    
                if (isNaN(xi) || isNaN(fx)) {
                    throw new Error("Invalid point values");
                }
    
                // f(x_i) = f_i
                newMatrix[row][4 * i] = xi ** 3;
                newMatrix[row][4 * i + 1] = xi ** 2;
                newMatrix[row][4 * i + 2] = xi;
                newMatrix[row][4 * i + 3] = 1;
                newRHS[row] = fx;
                row++;
    
                // f(x_{i+1}) = f_{i+1}
                newMatrix[row][4 * i] = nextXi ** 3;
                newMatrix[row][4 * i + 1] = nextXi ** 2;
                newMatrix[row][4 * i + 2] = nextXi;
                newMatrix[row][4 * i + 3] = 1;
                newRHS[row] = nextFx;
                row++;
            });
    
            // Add slope continuity (f'(x_i) = f'(x_{i+1}))
            for (let i = 0; i < n - 2; i++) {
                const xValue = parseFloat(points[selectedPoints[i]].x);
                newMatrix[row][4 * i] = 3 * xValue ** 2;
                newMatrix[row][4 * i + 1] = 2 * xValue;
                newMatrix[row][4 * i + 2] = 1;
                newMatrix[row][4 * (i + 1)] = -3 * xValue ** 2;
                newMatrix[row][4 * (i + 1) + 1] = -2 * xValue;
                newMatrix[row][4 * (i + 1) + 2] = -1;
                newRHS[row] = 0;
                row++;
            }
    
            // Add second derivative continuity (f''(x_i) = f''(x_{i+1}))
            for (let i = 0; i < n - 2; i++) {
                const xValue = parseFloat(points[selectedPoints[i]].x);
                newMatrix[row][4 * i] = 6 * xValue;
                newMatrix[row][4 * i + 1] = 2;
                newMatrix[row][4 * (i + 1)] = -6 * xValue;
                newMatrix[row][4 * (i + 1) + 1] = -2;
                newRHS[row] = 0;
                row++;
            }
    
            // Natural spline condition (f''(x_0) = f''(x_n) = 0)
            newMatrix[row][0] = 2; // Second derivative at the first point
            newRHS[row] = 0;
            row++;
            newMatrix[row][4 * (n - 2) + 1] = 2; // Second derivative at the last point
            newRHS[row] = 0;
    
            setMatrix(newMatrix);
            setRHS(newRHS);
            calculateCramersRule(newMatrix, newRHS);
            
        } catch (error) {
            toast.error(error.message || "An error occurred during calculation");
            console.error("Calculation error:", error);
        }
    };
    
    // Function to calculate Cramer’s Rule remains the same
    const calculateCramersRule = (matrix, rhs) => {
        const detA = det(matrix);
        if (detA === 0) {
            alert("The matrix is singular, no unique solution.");
            return;
        }
    
        const solutions = {};
        for (let i = 0; i < matrix.length; i++) {
            const Ai = JSON.parse(JSON.stringify(matrix)); // Create a copy of A
            for (let j = 0; j < matrix.length; j++) {
                Ai[j][i] = rhs[j]; // Replace the i-th column with rhs
            }
            const detAi = det(Ai);
            solutions[`a${Math.floor(i / 4) + 1}${i % 4 + 1}`] = (detAi / detA).toFixed(6); // Format to a1, b1, c1, d1, ...
        }
        setSolutions(solutions);
    
        // Calculate the spline functions using the solutions
        const calculatedResults = xValues.map((xValue, index) => {
            const coeffs = [
                parseFloat(solutions[`a${index + 1}1`]) || 0,
                parseFloat(solutions[`a${index + 1}2`]) || 0,
                parseFloat(solutions[`a${index + 1}3`]) || 0,
                parseFloat(solutions[`a${index + 1}4`]) || 0,
            ];
            const x = parseFloat(xValue);
            return coeffs[0] * x ** 3 + coeffs[1] * x ** 2 + coeffs[2] * x + coeffs[3]; // f(x) = ax^3 + bx^2 + cx + d
        });
        setResult(calculatedResults); // Set calculated results
    };
    
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Cubic Spline Interpolation</h2>

                {/* Dynamic points input */}
                <div>
                    <h3 className="text-xl mb-3">Enter Points Data </h3>
                    {points.map((point, index) => (
                        <div key={index} className="mb-3">
                            <label>Point {index + 1}:</label>
                            <input
                                type="number"
                                className="mx-2 p-2 border rounded-md"
                                placeholder="x"
                                value={point.x}
                                onChange={(e) => handlePointChange(index, 'x', e.target.value)}
                            />
                            <input
                                type="number"
                                className="mx-2 p-2 border rounded-md"
                                placeholder="f(x)"
                                value={point.fx}
                                onChange={(e) => handlePointChange(index, 'fx', e.target.value)}
                            />
                            {points.length > 2 && (
                                <button
                                    onClick={() => removePoint(index)}
                                    className="mx-2 px-2 py-1 bg-red-500 text-white rounded-md">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Button to add more points */}
                <button
                    onClick={addPoint}
                    className="my-3 px-4 py-2 bg-gray-500 text-white rounded-md">
                    Add Point
                </button>

                {/* Input x value */}
                <div>
                    <label className="text-gray-500">Enter x value for interpolation</label>
                    <input
                        type="number"
                        className="block w-full my-3 p-2 border rounded-md"
                        placeholder="x value"
                        value={xValue}
                        onChange={(e) => setXValue(e.target.value)}
                    />
                </div>

                {/* Select points for interpolation */}
                <div className="flex space-x-6">
                    {selectedPoints.map((point, index) => (
                        <div key={index}>
                            <label className="text-gray-500">Select Point {index + 1}</label>
                            <input
                                type="number"
                                className="block w-full my-3 p-2 border rounded-md"
                                placeholder={`Point ${index + 1} index`}
                                value={point + 1} // Display as 1-based index
                                onChange={(e) => {
                                    const newPoints = [...selectedPoints];
                                    newPoints[index] = parseInt(e.target.value) - 1; // Update 0-based index
                                    setSelectedPoints(newPoints);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Calculate button */}
                <button
                    onClick={calculateCubicSpline}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate
                </button>

                {/* Display result */}
                {result !== null && (
                    <div className="mt-5">
                        <p>Interpolated y value: {result.toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CubicSpline;
