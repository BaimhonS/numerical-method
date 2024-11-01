import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const LinearRegression = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [result, setResult] = useState({ slope: null, intercept: null }); // Result of regression
    const [matrix, setMatrix] = useState(null); // Matrix display
    const [xInput, setXInput] = useState(''); // Input x value for estimation
    const [fxResult, setFxResult] = useState(null); // Result of f(x)

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

    // Calculate linear regression and matrix display
    const calculateLinearRegression = () => {
        const n = points.length;
        if (n < 2) {
            alert("Please enter at least two points for linear regression.");
            return;
        }

        // Convert points to numbers
        const x = points.map(p => parseFloat(p.x));
        const y = points.map(p => parseFloat(p.fx));

        // Calculate sums
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

        // Calculate slope (m) and intercept (b)
        const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        // Update the result state
        setResult({ slope: m, intercept: b });

        // Update the matrix state
        setMatrix({
            n,
            sumX: sumX,
            sumY: sumY,
            sumXX: sumXX,
            sumXY: sumXY
        });
    };

    // Calculate f(x) for the input x value
    const calculateFx = () => {
        if (result.slope !== null && result.intercept !== null) {
            const xValue = parseFloat(xInput);
            const fxValue = result.slope * xValue + result.intercept;
            setFxResult(fxValue);
        } else {
            alert("Please calculate linear regression first.");
        }
    };

    const fetchExampleInput = () => {
        axios.get('/numerical-method/least-squares-regression/linear-regression/1')
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
                setXInput(data.xvalue.toString());
            })
            .catch((error) => {
                console.error("Error fetching example input:", error);
            });
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Linear Regression</h2>
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

                {/* Calculate button */}
                <button
                    onClick={calculateLinearRegression}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate Linear Regression
                </button>

                {/* Input x value for f(x) estimation */}
                <div>
                    <label className="text-gray-500">Enter x value to find f(x)</label>
                    <input
                        type="number"
                        className="block w-full my-3 p-2 border rounded-md"
                        placeholder="x value"
                        value={xInput}
                        onChange={(e) => setXInput(e.target.value)}
                    />
                </div>

                {/* Button to calculate f(x) */}
                <button
                    onClick={calculateFx}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md">
                    Calculate f(x)
                </button>

                {/* Display results */}
                {result.slope !== null && result.intercept !== null && (
                    <div className="mt-5">
                        <p>Linear Regression Equation: f(x) = {result.intercept.toFixed(6)} + {result.slope.toFixed(6)}x</p>
                    </div>
                )}

                {/* Matrix Display */}
                {matrix && (
                    <div className="mt-8">
                        <h3 className="text-xl mb-4">Matrix Equation</h3>
                        <div className="flex items-center space-x-4 font-mono">
                            
                            {/* Matrix values */}
                            <div className="grid grid-cols-2 gap-x-4 text-center">
                                <div className="px-4">{matrix.n}</div>
                                <div className="px-4">{matrix.sumX}</div>
                                <div className="px-4">{matrix.sumX}</div>
                                <div className="px-4">{matrix.sumXX}</div>
                            </div>

                            
                            {/* Matrix multiplication symbol */}
                            <div className="text-xl">×</div>
                        
                            
                            {/* Variables */}
                            <div className="grid grid-rows-2 gap-y-2">
                                <div className="px-4">a0</div>
                                <div className="px-4">a1</div>
                            </div>
                            
                            {/* Equals sign */}
                            <div className="text-xl">=</div>
                            
                            {/* Results */}
                            <div className="grid grid-rows-2 gap-y-2">
                                <div className="px-4">{matrix.sumY}</div>
                                <div className="px-4">{matrix.sumXY}</div>
                            </div>
                            
                        </div>
                    </div>
                )}

                {fxResult !== null && (
                    <div className="mt-5">
                        <p>f({xInput}) : {fxResult.toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinearRegression;
