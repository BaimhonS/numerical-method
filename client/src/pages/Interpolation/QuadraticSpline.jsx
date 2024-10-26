import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const QuadraticSpline = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [xValues, setXValues] = useState(['', '', '']); // Input 3 specific x values for quadratic spline
    const [result, setResult] = useState([null, null, null]); // Results for each x value
    const [matrix, setMatrix] = useState([]); // Store the generated matrix
    const [rhs, setRHS] = useState([]); // Store the right-hand side
    const [solutions, setSolutions] = useState({}); // Store Cramer's solutions

    // Function to handle input changes for points
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

    // Handle changes for the 3 x values
    const handleXValueChange = (index, value) => {
        const newXValues = [...xValues];
        newXValues[index] = value;
        setXValues(newXValues);
    };

    // Function to create the matrix for quadratic spline interpolation
    const calculateQuadraticSpline = () => {
        // Ensure there are at least three points
        if (points.length < 3) {
            alert("Please enter at least three points.");
            return;
        }

        // Parse input points to numeric values
        const parsedPoints = points.map(p => ({ x: parseFloat(p.x), fx: parseFloat(p.fx) }));
        const n = parsedPoints.length - 1;
        const matrixSize = 3 * n; // Matrix will have 3 rows per interval for quadratic spline
        const matrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
        const rhs = Array(matrixSize).fill(0); // Right-hand side (fx values)

        // Fill the matrix with conditions for each segment
        let row = 0;

        // 1. Conditions for f(x) values at each x in each segment
        for (let i = 0; i < n; i++) {
            const x1 = parsedPoints[i].x;
            const x2 = parsedPoints[i + 1].x;
            const fx1 = parsedPoints[i].fx;
            const fx2 = parsedPoints[i + 1].fx;

            matrix[row][3 * i] = x1 ** 2;
            matrix[row][3 * i + 1] = x1;
            matrix[row][3 * i + 2] = 1;
            rhs[row] = fx1;
            row++;

            matrix[row][3 * i] = x2 ** 2;
            matrix[row][3 * i + 1] = x2;
            matrix[row][3 * i + 2] = 1;
            rhs[row] = fx2;
            row++;
        }

        // 2. Slope continuity at each internal point
        for (let i = 1; i < n; i++) {
            const x = parsedPoints[i].x;

            matrix[row][3 * (i - 1)] = 2 * x;
            matrix[row][3 * (i - 1) + 1] = 1;
            matrix[row][3 * i] = -2 * x;
            matrix[row][3 * i + 1] = -1;
            rhs[row] = 0;
            row++;
        }

        // 3. Set the first a coefficient to 0 (natural spline condition)
        matrix[row][0] = 1;
        rhs[row] = 0;

        setMatrix(matrix); // Set the matrix state
        setRHS(rhs); // Set the RHS state
        setResult([null, null, null]); // Reset result
        calculateCramersRule(matrix, rhs); // Call Cramer's Rule after setting matrix
    };

    // Function to calculate the Cramer’s Rule
    const calculateCramersRule = (matrix, rhs) => {
        const detA = determinant(matrix);
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
            const detAi = determinant(Ai);
            solutions[`a${Math.floor(i / 3) + 1}${i % 3 + 1}`] = (detAi / detA).toFixed(6); // Format to a1, b1, c1, ...
        }
        setSolutions(solutions);

        // Calculate the spline functions using the solutions
        const calculatedResults = xValues.map((xValue, index) => {
            const coeffs = [
                parseFloat(solutions[`a${index + 1}1`]) || 0,
                parseFloat(solutions[`a${index + 1}2`]) || 0,
                parseFloat(solutions[`a${index + 1}3`]) || 0,
            ];
            const x = parseFloat(xValue);
            return coeffs[0] * x ** 2 + coeffs[1] * x + coeffs[2]; // f(x) = ax^2 + bx + c
        });
        setResult(calculatedResults); // Set calculated results
    };

    // Function to calculate the determinant of a matrix
    const determinant = (matrix) => {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let i = 0; i < n; i++) {
            const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
            det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix);
        }
        return det;
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Quadratic Spline Interpolation</h2>

                {/* Dynamic points input */}
                <div>
                    <h3 className="text-xl mb-3">Enter Points Data</h3>
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
                            {points.length > 1 && (
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

                {/* Input for 3 x values */}
                <div>
                    <h3 className="text-xl mb-3">Enter 3 X Values</h3>
                    {xValues.map((xVal, index) => (
                        <div key={index} className="mb-3">
                            <label>X Value {index + 1}:</label>
                            <input
                                type="number"
                                className="mx-2 p-2 border rounded-md"
                                placeholder={`x${index + 1}`}
                                value={xVal}
                                onChange={(e) => handleXValueChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={calculateQuadraticSpline}
                    className="my-3 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate
                </button>

                {/* Show matrix */}
                {matrix.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-xl mb-3">Matrix</h3>
                        <table className="border-collapse border border-white w-full">
                            <tbody>
                                {matrix.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((value, colIndex) => (
                                            <td key={colIndex} className="border border-white p-2 text-center">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Display results */}
                {Object.keys(solutions).length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-xl mb-3">Coefficients</h3>
                        <table className="border-collapse border border-white w-full">
                            <thead>
                                <tr>
                                    <th className="border border-white p-2">Segment</th>
                                    <th className="border border-white p-2">a</th>
                                    <th className="border border-white p-2">b</th>
                                    <th className="border border-white p-2">c</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: Math.ceil(Object.keys(solutions).length / 3) }, (_, i) => {
                                    const a = solutions[`a${i + 1}1`] || '0';
                                    const b = solutions[`a${i + 1}2`] || '0';
                                    const c = solutions[`a${i + 1}3`] || '0';
                                    return (
                                        <tr key={i}>
                                            <td className="border border-white p-2">{i + 1}</td>
                                            <td className="border border-white p-2">{a}</td>
                                            <td className="border border-white p-2">{b}</td>
                                            <td className="border border-white p-2">{c}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Display calculated results */}
                {result.some(res => res !== null) && (
                    <div className="mt-5">
                        <h3 className="text-xl mb-3">Calculated Results</h3>
                        <ul>
                            {result.map((val, index) => (
                                <li key={index}>
                                    f{index + 1}(x) = {val !== null ? val.toFixed(6) : 'N/A'}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuadraticSpline;
