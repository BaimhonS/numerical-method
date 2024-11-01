import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const PolynomialLagrange = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [pointIndices, setPointIndices] = useState([]); // Selected point indices
    const [xValue, setXValue] = useState(0); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation

    const fetchExampleInput = () => {
        axios.get('/numerical-method/interpolation/polynomial-newton/2')
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
                
                // Parse point string to get indices
                const selectedPoints = data.point.split(',').map(p => {
                    const index = parseInt(p.trim().replace('x:', '')) - 1; // Convert to 0-based index
                    return index;
                });
                
                setPoints(pointsArray);
                setXValue(parseFloat(data.xvalue));
                setPointIndices(selectedPoints);
                
                console.log("Points array:", pointsArray);
                console.log("Selected indices:", selectedPoints);
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
        setPointIndices(pointIndices.filter(point => point !== index));
    };

    // Update selected point indices
    const handleIndexChange = (index, value) => {
        const newPointIndices = [...pointIndices];
        newPointIndices[index] = value - 1; // Adjusting for zero-based index
        setPointIndices(newPointIndices);
    };

    // Validate inputs before calculation
    const validateInputs = () => {
        // Check if we have enough points
        if (points.length < 3) {
            alert("Please enter at least 3 points for calculation.");
            return false;
        }

        // Check if all points have valid values
        const hasInvalidPoints = points.some(point => 
            point.x === '' || point.fx === '' || 
            isNaN(point.x) || isNaN(point.fx)
        );

        if (hasInvalidPoints) {
            alert("Please fill in all points with valid numeric values.");
            return false;
        }

        return true;
    };

    // Calculate Lagrange interpolation
    const calculateQuadraticLagrange = () => {
        if (!validateInputs()) return;

        try {
            const x = parseFloat(xValue);
            let interpolatedY = 0;

            // Get selected points
            const selected = pointIndices.slice(0, 3).map(index => points[index]);
            
            // Validate selected points exist
            if (selected.some(point => !point)) {
                alert("Please select valid point indices");
                return;
            }

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
        } catch (error) {
            alert("Error in calculation. Please check your inputs.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Polynomial Lagrange Interpolation</h2>
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
                    data-testid="calculate-button"
                    onClick={calculateQuadraticLagrange}
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

export default PolynomialLagrange;
