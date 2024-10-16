import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const PolynomialNewton = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [pointIndices, setPointIndices] = useState([0, 1, 2, 3, 4]); // Array for selected point indices
    const [xValue, setXValue] = useState(0); // Input x value
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
        setPointIndices(pointIndices.filter(point => point !== index));
    };

    // Update selected point indices
    const handleIndexChange = (index, value) => {
        const newPointIndices = [...pointIndices];
        newPointIndices[index] = value - 1; // Adjusting for zero-based index
        setPointIndices(newPointIndices);
    };

    // Calculate the divided differences
    const calculateDividedDifferences = (points) => {
        const n = points.length;
        const dividedDifferences = Array(n).fill(null).map(() => Array(n).fill(0));

        // Set the function values
        for (let i = 0; i < n; i++) {
            dividedDifferences[i][0] = parseFloat(points[i].fx);
        }

        // Calculate divided differences
        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                dividedDifferences[i][j] = (dividedDifferences[i + 1][j - 1] - dividedDifferences[i][j - 1]) / 
                                           (parseFloat(points[i + j].x) - parseFloat(points[i].x));
            }
        }
        return dividedDifferences;
    };

    // Calculate Newton's polynomial interpolation
    const calculatePolynomialInterpolation = () => {
        const selected = pointIndices.map(i => points[i]); // Get selected points
        if (selected.length < 2) {
            alert("Please select at least two points.");
            return;
        }

        const dividedDifferences = calculateDividedDifferences(selected);
        const n = selected.length;
        let interpolatedValue = 0;

        for (let i = 0; i < n; i++) {
            let term = dividedDifferences[0][i];
            for (let j = 0; j < i; j++) {
                term *= (xValue - parseFloat(selected[j].x));
            }
            interpolatedValue += term;
        }

        setResult(interpolatedValue);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Polynomial Newton Interpolation</h2>
                
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

                {/* Selection of points */}
                <div className="flex space-x-6">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div key={index}>
                            <label className="text-gray-500">Select Point {index + 1}</label>
                            <input
                                type="number"
                                className="block w-full my-3 p-2 border rounded-md"
                                placeholder={`Point ${index + 1} index`}
                                value={pointIndices[index] + 1} // Adjusted to be 1-based
                                onChange={(e) => handleIndexChange(index, parseInt(e.target.value))}
                            />
                        </div>
                    ))}
                </div>

                {/* Input x value */}
                <div>
                    <label className="text-gray-500">Enter x value for interpolation</label>
                    <input
                        type="number"
                        className="block w-full my-3 p-2 border rounded-md"
                        placeholder="x value"
                        value={xValue}
                        onChange={(e) => setXValue(parseFloat(e.target.value))}
                    />
                </div>

                {/* Calculate button */}
                <button
                    onClick={calculatePolynomialInterpolation}
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

export default PolynomialNewton;
