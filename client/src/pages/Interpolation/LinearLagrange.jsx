import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const LinearLagrangeInterpolation = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Two points for interpolation
    const [point1, setPoint1] = useState(0); // Index for point 1
    const [point2, setPoint2] = useState(1); // Index for point 2
    const [xValue, setXValue] = useState(0); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation

    // Function to handle input changes
    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
    };

    const addPoint = () => {
        setPoints([...points, { x: '', fx: '' }]);
    };

    // Remove a point
    const removePoint = (index) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        // Adjust the selected points if they are removed
        if (index === point1 || index === point2) {
            if (point2 > 0) setPoint2(point2 - 1);
            if (point1 > 0) setPoint1(point1 - 1);
        }
    };
    
    const calculateLinearLagrangeInterpolation = () => {
        const selectedPoints = [points[point1], points[point2]];
        const interpolatedY = selectedPoints.reduce((sum, point, index) => {
        let term = parseFloat(point.fx);
        for (let j = 0; j < selectedPoints.length; j++) {
            if (index !== j) {
                term *= (xValue - parseFloat(selectedPoints[j].x)) / (parseFloat(point.x) - parseFloat(selectedPoints[j].x));
            }
        }
        return sum + term;
        }, 0);

        setResult(interpolatedY);
    };
    
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Linear Lagrange Interpolation</h2>
                
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

                {/* Selection of point1 and point2 */}
                <div className="flex space-x-6">
                    <div>
                        <label className="text-gray-500">Select Point 1</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 1 index"
                            value={point1 + 1}
                            onChange={(e) => setPoint1(parseInt(e.target.value) - 1)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Select Point 2</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 2 index"
                            value={point2 + 1}
                            onChange={(e) => setPoint2(parseInt(e.target.value) - 1)}
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
                    onClick={calculateLinearLagrangeInterpolation}
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

export default LinearLagrangeInterpolation;