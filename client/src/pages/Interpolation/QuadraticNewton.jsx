import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const QuadraticNewton = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [point1, setPoint1] = useState(0); // Index for Point 1 (Default is first point)
    const [point2, setPoint2] = useState(1); // Index for Point 2 (Default is second point)
    const [point3, setPoint3] = useState(2); // Index for Point 3 (Default is third point)
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
    };

    const calculateQuadraticInterpolation = () => {
        if (points.length > point1 && points.length > point2 && points.length > point3) {
            const x1 = parseFloat(points[point1].x);
            const fx1 = parseFloat(points[point1].fx);
            const x2 = parseFloat(points[point2].x);
            const fx2 = parseFloat(points[point2].fx);
            const x3 = parseFloat(points[point3].x);
            const fx3 = parseFloat(points[point3].fx);
            const x = parseFloat(xValue);

            // Calculate the interpolated y value using the quadratic formula
            let interpolatedY =  
                (((fx3 - fx2) / (x3 - x2)) - ((fx2 - fx1) / (x2 - x1))) / (x3 - x1);

                let c1 = (fx2 - fx1) / (x2 - x1);
                interpolatedY = fx1 + (c1 * (xValue - x1)) + ((interpolatedY) * (xValue - x1) * (xValue - x2));

            setResult(interpolatedY);
        } else {
            alert("Please select valid points for calculation.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Quadratic Interpolation</h2>
                
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
                    <div>
                        <label className="text-gray-500">Select Point 3</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 3 index"
                            value={point3 + 1}
                            onChange={(e) => setPoint3(parseInt(e.target.value) - 1)}
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
                    onClick={calculateQuadraticInterpolation}
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

export default QuadraticNewton;
