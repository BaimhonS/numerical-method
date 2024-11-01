import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { det } from 'mathjs';
import { toast } from 'react-toastify';
import axios from 'axios';

const CubicSpline = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [xValue, setXValue] = useState(0); // Input x value
    const [selectedPoints, setSelectedPoints] = useState([0, 1, 2, 3]); // Selected points indices
    const [result, setResult] = useState(null); // Result of interpolation
    const [matrix, setMatrix] = useState([]); // Add state for matrix
    const [rhs, setRHS] = useState([]); // Add state for right-hand side
    const [solutions, setSolutions] = useState({}); // Add state for solutions

    const fetchExampleInput = () => {
        axios.get('/numerical-method/interpolation/polynomial-newton/1')
            .then((response) => {
                const data = response.data;
                console.log("Raw data from server:", data);
                
                // Parse points string into array of objects
                const pointsArray = data.points.split(',').map(point => {
                    const [x, fx] = point.trim().split(' ');
                    return {
                        x: x.replace('x:', '').trim(),
                        fx: fx.replace('fx:', '').trim()
                    };
                });
                console.log("Parsed points:", pointsArray);
                
                // Parse xvalue (it's a single number, not an array)
                console.log("Parsed xvalue:", data.xvalue);
                
                setPoints(pointsArray.map(point => ({
                    x: point.x,
                    fx: point.fx
                })));
                setXValue(parseFloat(data.xvalue)); // Just parse the single number
                
                // Update selected points based on data length
                const selectedIndices = Array.from(
                    { length: Math.min(4, pointsArray.length) }, 
                    (_, i) => i
                );
                setSelectedPoints(selectedIndices);
                
            })
            .catch((error) => {
                console.error("Error fetching example input:", error);
                console.error("Error details:", error.response?.data);
            });
    };

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

    // Add validation function
    const validateInputs = () => {
        // Check if we have enough points
        if (points.length < 2) {
            toast.error("Need at least 2 points for interpolation");
            return false;
        }

        // Check if all points have valid x and fx values
        for (let i = 0; i < points.length; i++) {
            if (points[i].x === '' || points[i].fx === '' || 
                isNaN(points[i].x) || isNaN(points[i].fx)) {
                toast.error(`Invalid value at point ${i + 1}`);
                return false;
            }
        }

        // Check if x values are unique and in ascending order
        for (let i = 1; i < points.length; i++) {
            if (parseFloat(points[i].x) <= parseFloat(points[i - 1].x)) {
                toast.error("X values must be unique and in ascending order");
                return false;
            }
        }

        // Check if interpolation x value is valid
        if (xValue === '' || isNaN(xValue)) {
            toast.error("Invalid interpolation x value");
            return false;
        }

        // Check if x value is within the range of points
        const minX = Math.min(...points.map(p => parseFloat(p.x)));
        const maxX = Math.max(...points.map(p => parseFloat(p.x)));
        if (parseFloat(xValue) < minX || parseFloat(xValue) > maxX) {
            toast.error("Interpolation x value must be within the range of points");
            return false;
        }

        return true;
    };

    const calculateCubicSpline = () => {
        if (!validateInputs()) return;
    
        try {
            const sortedPoints = [...selectedPoints].sort((a, b) => a - b); // Sort points
            const n = sortedPoints.length; // Number of segments
            const matrixSize = 4 * (n - 1); // 4 equations per segment
            const newMatrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
            const newRHS = Array(matrixSize).fill(0);
            
            let row = 0;
    
            // Fill matrix with f(x) conditions for each segment
            sortedPoints.forEach((pointIndex, i) => {
                if (i >= n - 1) return; // Skip last iteration since we're working with segments
    
                if (pointIndex >= points.length || !points[pointIndex]) {
                    throw new Error("Invalid point index");
                }
    
                const xi = parseFloat(points[pointIndex].x);
                const fx = parseFloat(points[pointIndex].fx);
                const nextXi = parseFloat(points[pointIndex + 1].x);
                const nextFx = parseFloat(points[pointIndex + 1].fx);
    
                if (isNaN(xi) || isNaN(fx) || isNaN(nextXi) || isNaN(nextFx)) {
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
    
            // Add slope continuity
            for (let i = 0; i < n - 2; i++) {
                const xValue = parseFloat(points[sortedPoints[i]].x);
                newMatrix[row][4 * i] = 3 * xValue ** 2;
                newMatrix[row][4 * i + 1] = 2 * xValue;
                newMatrix[row][4 * i + 2] = 1;
                newMatrix[row][4 * (i + 1)] = -3 * xValue ** 2;
                newMatrix[row][4 * (i + 1) + 1] = -2 * xValue;
                newMatrix[row][4 * (i + 1) + 2] = -1;
                newRHS[row] = 0;
                row++;
            }
    
            // Add second derivative continuity
            for (let i = 0; i < n - 2; i++) {
                const xValue = parseFloat(points[sortedPoints[i]].x);
                newMatrix[row][4 * i] = 6 * xValue;
                newMatrix[row][4 * i + 1] = 2;
                newMatrix[row][4 * (i + 1)] = -6 * xValue;
                newMatrix[row][4 * (i + 1) + 1] = -2;
                newRHS[row] = 0;
                row++;
            }
    
            // Natural spline condition
            newMatrix[row][0] = 2; // Second derivative at first point
            newRHS[row] = 0;
            row++;
            newMatrix[row][4 * (n - 2) + 1] = 2; // Second derivative at last point
            newRHS[row] = 0;
    
            setMatrix(newMatrix);
            setRHS(newRHS);
            calculateCramersRule(newMatrix, newRHS);
            
        } catch (error) {
            toast.error(error.message || "An error occurred during calculation");
            console.error("Calculation error:", error);
        }
    };
    
    // Function to calculate Cramer's Rule
    const calculateCramersRule = (matrix, rhs) => {
        try {
            const detA = det(matrix);
            if (detA === 0) {
                toast.error("The matrix is singular, no unique solution.");
                return;
            }

            const solutions = {};
            for (let i = 0; i < matrix.length; i++) {
                const Ai = JSON.parse(JSON.stringify(matrix)); // Create a copy of A
                for (let j = 0; j < matrix.length; j++) {
                    Ai[j][i] = rhs[j]; // Replace the i-th column with rhs
                }
                const detAi = det(Ai);
                solutions[`a${Math.floor(i / 4) + 1}${i % 4 + 1}`] = (detAi / detA).toFixed(6);
            }
            setSolutions(solutions);

            // Calculate interpolated value
            const x = parseFloat(xValue);
            let result = 0;
            const n = selectedPoints.length - 1;

            // Find which segment the x value falls into
            for (let i = 0; i < n; i++) {
                const x1 = parseFloat(points[selectedPoints[i]].x);
                const x2 = parseFloat(points[selectedPoints[i + 1]].x);
                
                if (x >= x1 && x <= x2) {
                    const coeffs = [
                        parseFloat(solutions[`a${i + 1}1`]) || 0,
                        parseFloat(solutions[`a${i + 1}2`]) || 0,
                        parseFloat(solutions[`a${i + 1}3`]) || 0,
                        parseFloat(solutions[`a${i + 1}4`]) || 0,
                    ];
                    result = coeffs[0] * x ** 3 + coeffs[1] * x ** 2 + coeffs[2] * x + coeffs[3];
                    break;
                }
            }

            setResult(result);
            
        } catch (error) {
            toast.error("Error in Cramer's Rule calculation");
            console.error("Cramer's Rule error:", error);
        }
    };
    
    // Add function to render matrix
    const renderMatrix = () => {
        if (!matrix.length) return null;
        
        return (
            <div className="mt-5">
                <h3 className="text-xl mb-3 text-center">System of Equations Matrix</h3>
                <div className="overflow-x-auto">
                    <div className="flex justify-center items-start">
                        <div className="border-1">
                            <table className="border-separate border-spacing-3">
                                <tbody>
                                    {matrix.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} className="p-2 text-center min-w-[60px]">
                                                    {parseFloat(cell)}
                                                </td>
                                            ))}
                                            <td className="p-2 text-center min-w-[60px] font-bold">
                                                = {parseFloat(rhs[i])}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Update the renderResults function to display all results
    const renderResults = () => {
        if (!Object.keys(solutions).length) return null;

        return (
            <div className="mt-5">
                <h3 className="text-xl mb-3 text-center">Coefficients and Results</h3>
                <div className="overflow-x-auto">
                    <table className="border-collapse border border-white w-full">
                        <thead>
                            <tr>
                                <th className="border border-white p-2">Segment</th>
                                <th className="border border-white p-2">a (x³)</th>
                                <th className="border border-white p-2">b (x²)</th>
                                <th className="border border-white p-2">c (x)</th>
                                <th className="border border-white p-2">d</th>
                                <th className="border border-white p-2">Equation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: Math.ceil(Object.keys(solutions).length / 4) }, (_, i) => {
                                const a = parseFloat(solutions[`a${i + 1}1`]) || 0;
                                const b = parseFloat(solutions[`a${i + 1}2`]) || 0;
                                const c = parseFloat(solutions[`a${i + 1}3`]) || 0;
                                const d = parseFloat(solutions[`a${i + 1}4`]) || 0;

                                return (
                                    <tr key={i}>
                                        <td className="border border-white p-2 text-center">{i + 1}</td>
                                        <td className="border border-white p-2 text-center">{a.toFixed(6)}</td>
                                        <td className="border border-white p-2 text-center">{b.toFixed(6)}</td>
                                        <td className="border border-white p-2 text-center">{c.toFixed(6)}</td>
                                        <td className="border border-white p-2 text-center">{d.toFixed(6)}</td>
                                        <td className="border border-white p-2 text-center">
                                            {`f${i + 1}(x) = ${a.toFixed(6)}x³ + ${b.toFixed(6)}x² + ${c.toFixed(6)}x + ${d.toFixed(6)}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-5 text-center">
                    <h4 className="text-lg mb-2">Interpolated Value at x = {xValue}</h4>
                    <p className="text-xl font-bold">f({xValue}) = {result}</p>
                </div>

                {/* Display points used */}
                <div className="mt-5">
                    <h4 className="text-lg mb-2">Points Used:</h4>
                    <ul className="list-disc pl-5">
                        {selectedPoints.map((pointIndex, i) => (
                            <li key={i}>
                                Point {i + 1}: ({points[pointIndex].x}, {points[pointIndex].fx})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Cubic Spline Interpolation</h2>
                <div className="flex justify-end px-10">
                <button
                    onClick={fetchExampleInput}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                    Get Example Input
                </button>
                </div>
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

                {/* Display results */}
                {result !== null && (
                    <div className="mt-5">
                        {renderMatrix()}
                        {renderResults()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CubicSpline;
