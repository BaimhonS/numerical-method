import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const PolynomialLagrange = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [pointIndices, setPointIndices] = useState([0, 1, 2, 3, 4]); // Selected point indices
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

    // Calculate Lagrange interpolation
    const calculateLagrangeInterpolation = () => {
        const selected = pointIndices.map(i => points[i]); // Get selected points
        if (selected.length < 2) {
            alert("Please select at least two points.");
            return;
        }

        const x = parseFloat(xValue);
        let interpolatedY = 0;

        // Calculate the Lagrange interpolation
        for (let i = 0; i < selected.length; i++) {
            const xi = parseFloat(selected[i].x);
            const fx = parseFloat(selected[i].fx);
            let term = fx;

            for (let j = 0; j < selected.length; j++) {
                if (i !== j) {
                    const xj = parseFloat(selected[j].x);
                    term *= (x - xj) / (xi - xj);
                }
            }

            interpolatedY += term;
        }

        setResult(interpolatedY);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Polynomial Lagrange Interpolation</h2>

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
                    onClick={calculateLagrangeInterpolation}
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

export default PolynomialLagrange;
