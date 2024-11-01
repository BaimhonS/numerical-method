import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const QuadraticLagrange = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [point1, setPoint1] = useState(0); // Index for the first selected point
    const [point2, setPoint2] = useState(1); // Index for the second selected point
    const [point3, setPoint3] = useState(2); // Index for the third selected point
    const [xValue, setXValue] = useState(0); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation

    const fetchExampleInput = () => {
        axios.get('/numerical-method/interpolation/quadratic-newton/2')
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
                setXValue(parseFloat(data.xvalue));

                // Fix point selection
                const selectedPoints = data.point.split(',').map(p => 
                    parseInt(p.trim().replace('x:', '')) - 1
                );
                setPoint1(selectedPoints[0]);
                setPoint2(selectedPoints[1]);
                setPoint3(selectedPoints[2]);
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
        // Adjust the selected points if they are removed
        if (index === point1 || index === point2 || index === point3) {
            if (point3 > 0) setPoint3(point3 - 1);
            if (point2 > 0) setPoint2(point2 - 1);
            if (point1 > 0) setPoint1(point1 - 1);
        }
    };

    // Calculate Lagrange interpolation
    const calculateQuadraticLagrange = () => {
        if (points.length >= 3) {
            const x = parseFloat(xValue);
            let interpolatedY = 0;
    
            // Lagrange interpolation formula
            const selectedPoints = [point1, point2, point3];
    
            for (let i = 0; i < 3; i++) {
                const xi = parseFloat(points[selectedPoints[i]].x);
                const fx = parseFloat(points[selectedPoints[i]].fx);
                let term = fx;
    
                for (let j = 0; j < 3; j++) {
                    if (j !== i) {
                        const xj = parseFloat(points[selectedPoints[j]].x);
                        term *= (x - xj) / (xi - xj);
                    }
                }
                interpolatedY += term;
            }
    
            setResult(interpolatedY);
        } else {
            alert("Please enter at least 3 points for calculation.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Quadratic Lagrange Interpolation</h2>
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
                    onClick={calculateQuadraticLagrange}
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

export default QuadraticLagrange;
