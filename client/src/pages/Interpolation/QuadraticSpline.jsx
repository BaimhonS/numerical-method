import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { toast } from "sonner";
import { det } from 'mathjs';
import axios from 'axios';

const QuadraticSpline = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]);
    const [xValues, setXValues] = useState(['', '', '']);
    const [point1, setPoint1] = useState(0);
    const [point2, setPoint2] = useState(1);
    const [point3, setPoint3] = useState(2);
    const [result, setResult] = useState([null, null, null]);
    const [matrix, setMatrix] = useState([]);
    const [rhs, setRHS] = useState([]);
    const [solutions, setSolutions] = useState({});

    const fetchExampleInput = () => {
        axios.get('/numerical-method/interpolation/quadratic-spline/1')
            .then((response) => {
                const data = response.data;
                
                // Parse points string into array of objects
                const pointsArray = data.points.split(',').map(point => {
                    const [x, fx] = point.trim().split(' ');
                    return {
                        x: x.replace('x:', '').trim(),
                        fx: fx.replace('fx:', '').trim()
                    };
                });
                
                setPoints(pointsArray);

                // Parse x values with x: prefix
                const xValuesArray = data.xvalue.split(',').map(x => 
                    x.trim().replace('x:', '').trim()
                );
                setXValues(xValuesArray);

                // Set point selections
                const selectedPoints = data.point.split(',').map(p => 
                    parseInt(p.trim().replace('x:', '')) - 1
                );
                setPoint1(selectedPoints[0]);
                setPoint2(selectedPoints[1]);
                setPoint3(selectedPoints[2]);
            })
            .catch((error) => {
                console.error("Error fetching example input:", error);
                toast.error("Failed to fetch example data");
            });
    };

    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
    };

    const addPoint = () => {
        setPoints([...points, { x: '', fx: '' }]);
    };

    const removePoint = (index) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        if (index === point1 || index === point2 || index === point3) {
            if (point3 > 0) setPoint3(point3 - 1);
            if (point2 > 0) setPoint2(point2 - 1);
            if (point1 > 0) setPoint1(point1 - 1);
        }
    };

    const handleXValueChange = (index, value) => {
        const newXValues = [...xValues];
        newXValues[index] = value;
        setXValues(newXValues);
    };

    const validateInputs = () => {
        // Check if we have enough points
        if (points.length < 3) {
            toast.error("Please enter at least 3 points");
            return false;
        }

        // Check if all points have valid x and fx values
        const hasInvalidPoints = points.some(point => 
            point.x === '' || point.fx === '' || 
            isNaN(parseFloat(point.x)) || isNaN(parseFloat(point.fx))
        );
        if (hasInvalidPoints) {
            toast.error("All points must have valid x and f(x) values");
            return false;
        }

        // Check if x values are valid
        const hasInvalidXValues = xValues.some(x => x === '' || isNaN(parseFloat(x)));
        if (hasInvalidXValues) {
            toast.error("Please enter valid x values for calculation");
            return false;
        }

        // Check if selected point indices are valid
        if (point1 >= points.length || point2 >= points.length || point3 >= points.length) {
            toast.error("Selected point indices are invalid");
            return false;
        }

        return true;
    };

    const calculateQuadraticSpline = () => {
        if (!validateInputs()) return;

        try {
            const selectedPoints = [point1, point2, point3].sort((a, b) => a - b); // Sort points
            const parsedXValues = xValues.map(parseFloat);

            const matrixSize = 3 * parseFloat(points.length - 1);
            const newMatrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
            const newRHS = Array(matrixSize).fill(0);

            let row = 0;

            console.log("msize = ", matrixSize)

            // Fill matrix with f(x) conditions for each segment
            selectedPoints.forEach((pointIndex, i) => {
                if (pointIndex >= points.length || !points[pointIndex]) {
                    throw new Error("Invalid point index");
                }

                const xi = parseFloat(points[pointIndex].x);
                const fx = parseFloat(points[pointIndex].fx);
                const nextXi = parseFloat(points[pointIndex+1].x);
                const nextFx = parseFloat(points[pointIndex+1].fx);

                if (isNaN(xi) || isNaN(fx)) {
                    throw new Error("Invalid point values");
                }

                newMatrix[row][3 * i] = xi ** 2;
                newMatrix[row][3 * i + 1] = xi;
                newMatrix[row][3 * i + 2] = 1;
                newRHS[row] = fx;
                row++;

                newMatrix[row][3 * i] = nextXi ** 2;
                newMatrix[row][3 * i + 1] = nextXi;
                newMatrix[row][3 * i + 2] = 1;
                newRHS[row] = nextFx;
                row++;
            });


            // Add slope continuity
            console.log("len = ", parsedXValues.length)

            for (let i = 1; i < parsedXValues.length; i++) {
                const xValue = parseFloat(points[i].x);
                newMatrix[row][3 * (i - 1)] = 2 * xValue;
                newMatrix[row][3 * (i - 1) + 1] = 1;
                newMatrix[row][3 * i] = -2 * xValue;
                newMatrix[row][3 * i + 1] = -1;
                newRHS[row] = 0;
                row++;

            }

            // Natural spline condition
            newMatrix[row][0] = 1;
            newRHS[row] = 0;

            console.log(newMatrix)
            console.log

            setMatrix(newMatrix);
            setRHS(newRHS);
            calculateCramersRule(newMatrix, newRHS);
            
        } catch (error) {
            toast.error(error.message || "An error occurred during calculation");
            console.error("Calculation error:", error);
        }
    };

    // Function to calculate the Cramer’s Rule
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
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Quadratic Spline Interpolation</h2>
                <div className="flex justify-end">
                    <button
                        onClick={fetchExampleInput}
                        className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                        Get Example
                    </button>
                </div>
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

                {/* Selection of point1, point2, and point3 */}
                <div className="flex space-x-6">
                    <div>
                        <label className="text-gray-500">Select Point 1</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 1 index"
                            value={point1 + 1} // Display as 1-based index
                            onChange={(e) => setPoint1(parseInt(e.target.value) - 1)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Select Point 2</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 2 index"
                            value={point2 + 1} // Display as 1-based index
                            onChange={(e) => setPoint2(parseInt(e.target.value) - 1)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Select Point 3</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 3 index"
                            value={point3 + 1} // Display as 1-based index
                            onChange={(e) => setPoint3(parseInt(e.target.value) - 1)}
                        />
                    </div>
                </div>

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
                <div>
                    {/* Show matrix */}
                    {matrix.length > 0 && (
                        <div className="mt-5">
                            <h3 className="text-xl mb-3">Matrix</h3>
                            <div className="overflow-x-auto">
                                <div className="flex justify-center items-start">
                                    <div className="border-1">
                                        <table className="border-separate border-spacing-3">
                                            <tbody>
                                                {matrix.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {row.map((value, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className="p-2 text-center min-w-[60px]"
                                                            >
                                                                {value}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center">
                                        <table className="border-separate border-spacing-3">
                                            <tbody>
                                                {rhs.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="p-2 text-center min-w-[60px]">
                                                            = {value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
                        <h3 className="text-xl mb-3">Results</h3>
                        <ul className='flex space-x-5'>
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