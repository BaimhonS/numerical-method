import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const LinearSpline = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [xValue, setXValue] = useState(0); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation
    const [point1, setPoint1] = useState(0); // Index for Point 1
    const [point2, setPoint2] = useState(1); // Index for Point 2

    const fetchExampleInput = () => {
        axios.get('/numerical-method/interpolation/linear-newton/1')
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
                
                setPoints(pointsArray);
                setXValue(parseFloat(data.xvalue));
                
                const selectedPoints = data.point.split(',').map(p => 
                    parseInt(p.trim().replace('x:', '')) - 1
                );
                setPoint1(selectedPoints[0]);
                setPoint2(selectedPoints[1]);
            })
            .catch((error) => {
                console.error("Error fetching example input:", error);
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

    // Calculate Linear Spline interpolation
    const calculateLinearSpline = () => {
        const x = parseFloat(xValue);
        const n = points.length;

        // Sort points before interpolation
        sortPoints();

        // Check if x is within range of points
        if (x < parseFloat(points[0].x) || x > parseFloat(points[n - 1].x)) {
            alert("x is out of range of the provided points.");
            return;
        }

        let interpolatedY = null;

        // Find the interval where x lies and apply linear interpolation
        for (let i = 0; i < n - 1; i++) {
            const x0 = parseFloat(points[i].x);
            const y0 = parseFloat(points[i].fx);
            const x1 = parseFloat(points[i + 1].x);
            const y1 = parseFloat(points[i + 1].fx);

            if (x >= x0 && x <= x1) {
                // Linear interpolation formula: y = y0 + (y1 - y0) * (x - x0) / (x1 - x0)
                interpolatedY = y0 + (y1 - y0) * (x - x0) / (x1 - x0);
                break;
            }
        }

        setResult(interpolatedY);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Linear Spline Interpolation</h2>
                <div className="flex justify-end">
                    <button
                        onClick={fetchExampleInput}
                        className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                        Get Example
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

                {/* Select Point 1 and Point 2 for quadratic interpolation */}
                <div className="flex space-x-6 my-5">
                    <div>
                        <label className="text-gray-500">Select Point 1</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 1 index"
                            value={point1 + 1} // Display as 1-based index
                            onChange={(e) => setPoint1(Math.max(0, parseInt(e.target.value) - 1))}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Select Point 2</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Point 2 index"
                            value={point2 + 1} // Display as 1-based index
                            onChange={(e) => setPoint2(Math.max(0, parseInt(e.target.value) - 1))}
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
                        onChange={(e) => setXValue(e.target.value)}
                    />
                </div>

                {/* Calculate button */}
                <button
                    onClick={calculateLinearSpline}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate
                </button>

                {/* Display result */}
                {result !== null && (
                    <div className="mt-5" data-testid="result-value">
                        <p>Interpolated y value: {result.toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinearSpline;
