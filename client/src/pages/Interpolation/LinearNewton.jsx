import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const LinearInterpolation = () => {
    const [points, setPoints] = useState([
        { x: '', fx: '' }
    ]); // Dynamic points input
    const [point1, setPoint1] = useState(0); // Index for Point 1 (Default is first point)
    const [point2, setPoint2] = useState(1); // Index for Point 2 (Default is second point)
    const [xValue, setXValue] = useState(''); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation

    // Function to handle input changes
    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);

        // Reset result when points change
        setResult(null);
    };

    // Add new point
    const addPoint = () => {
        setPoints([...points, { x: '', fx: '' }]);
    };

    // Remove a point
    const removePoint = (index) => {
        if (points.length <= 1) return; // Don't remove last point
        
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        
        // Adjust point1 and point2 if needed
        if (point1 >= newPoints.length) setPoint1(newPoints.length - 1);
        if (point2 >= newPoints.length) setPoint2(newPoints.length - 1);
        
        // Reset result
        setResult(null);
    };

    // Calculate the divided differences for linear interpolation
    const calculateLinearDividedDifferences = (points) => {
        const n = points.length;
        const dividedDifferences = Array(n).fill(null).map(() => Array(n).fill(0));

        // Set the function values f(x) for each point
        for (let i = 0; i < n; i++) {
            dividedDifferences[i][0] = parseFloat(points[i].fx);
        }

        // Calculate the first order divided differences (linear interpolation)
        for (let i = 0; i < n - 1; i++) {
            dividedDifferences[i][1] = (dividedDifferences[i + 1][0] - dividedDifferences[i][0]) / 
                                       (parseFloat(points[i + 1].x) - parseFloat(points[i].x));
        }

        return dividedDifferences;
    };

    // Calculate Newton's linear interpolation
    const calculateLinearInterpolation = () => {
        try {
            // Validation checks
            if (!point1 || !point2) {
                throw new Error("Please select two points");
            }

            if (!xValue && xValue !== 0) {
                throw new Error("Please enter x value");
            }

            const selectedPoints = [points[point1], points[point2]];
            
            if (selectedPoints.some(point => !point?.x || !point?.fx)) {
                throw new Error("Please fill in all point values");
            }

            const dividedDifferences = calculateLinearDividedDifferences(selectedPoints);
            const x = parseFloat(xValue);
            
            // Validate calculation inputs
            if (isNaN(x) || selectedPoints.some(p => isNaN(parseFloat(p.x)) || isNaN(parseFloat(p.fx)))) {
                throw new Error("Invalid numeric inputs");
            }

            const interpolatedValue = dividedDifferences[0][0] + 
                                    dividedDifferences[0][1] * (x - parseFloat(selectedPoints[0].x));
            
            setResult(interpolatedValue);
        } catch (error) {
            alert(error.message);
            setResult(null);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Linear Interpolation</h2>
                
                {/* Dynamic points input */}
                <div>
                    <h3 className="text-xl mb-3">Enter Points Data</h3>
                    {points.map((point, index) => (
                        <div key={index} className="mb-4">
                            <span>Point {index + 1}:</span>
                            <input
                                type="number"
                                className="mx-2 p-2 border rounded-md"
                                placeholder="x"
                                value={point.x || ''}
                                onChange={(e) => handlePointChange(index, 'x', e.target.value)}
                            />
                            <input
                                type="number"
                                className="mx-2 p-2 border rounded-md"
                                placeholder="f(x)"
                                value={point.fx || ''}
                                onChange={(e) => handlePointChange(index, 'fx', e.target.value)}
                            />
                            {points.length > 1 && (
                                <button
                                    onClick={() => removePoint(index)}
                                    className="mx-2 px-2 py-1 bg-red-500 text-white rounded-md"
                                    data-testid={`remove-point-${index}`}
                                >
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

                {/* Selection of point1 and point2 */}
                <div className="flex space-x-6">
                    <div>
                        <label className="text-gray-500">Select Point 1</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 1 index"
                            value={point1 + 1}
                            min={1}
                            max={points.length}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1 && val <= points.length) {
                                    setPoint1(val - 1);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Select Point 2</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 2 index"
                            value={point2 + 1}
                            min={1}
                            max={points.length}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1 && val <= points.length) {
                                    setPoint2(val - 1);
                                }
                            }}
                        />
                    </div>
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
                    onClick={calculateLinearInterpolation}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate
                </button>

                {/* Display result */}
                {result !== null && (
                    <div className="mt-5">
                        <p>Interpolated y value: {Number(result).toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinearInterpolation;
