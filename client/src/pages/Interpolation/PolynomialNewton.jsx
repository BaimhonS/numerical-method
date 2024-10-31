import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const PolynomialNewton = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [pointIndices, setPointIndices] = useState([]); // Array for selected point indices
    const [xValue, setXValue] = useState(''); // Input x value
    const [result, setResult] = useState(null); // Result of interpolation

    // Function to handle input changes
    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
        setResult(null); // Reset result when points change
    };

    // Add new point
    const addPoint = () => {
        setPoints([...points, { x: '', fx: '' }]);
        setPointIndices([...pointIndices]); // Maintain selected points
    };

    // Remove a point
    const removePoint = (index) => {
        if (points.length <= 1) return; // ป้องกันการลบจุดสุดท้าย
        
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        
        // ปรับ pointIndices หลังจากลบจุด
        const newPointIndices = pointIndices
            .map(pointIndex => 
                pointIndex > index ? pointIndex - 1 : 
                pointIndex === index ? null : 
                pointIndex
            )
            .filter(index => index !== null);
        
        setPointIndices(newPointIndices);
    };

    // Update selected point indices
    const handleIndexChange = (index, value) => {
        if (!value || value < 1 || value > points.length) return;
        
        const adjustedIndex = value - 1;
        let newPointIndices = [...pointIndices];
        
        // ถ้า index มีอยู่แล้ว ให้อัพเดทค่า
        const existingIndex = newPointIndices.indexOf(index);
        if (existingIndex !== -1) {
            newPointIndices[existingIndex] = adjustedIndex;
        } else {
            // ถ้ายังไม่มี ให้เพิ่มเข้าไป
            newPointIndices.push(adjustedIndex);
        }
        
        // Remove duplicates and sort
        newPointIndices = [...new Set(newPointIndices)].sort((a, b) => a - b);
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
        try {
            // Check points selection first
            if (pointIndices.length < 2) {
                throw new Error("Please select at least two points.");
            }

            // Then validate x value
            if (!xValue) {
                throw new Error("Please enter x value");
            }

            // Get selected points
            const selectedPoints = pointIndices.map(i => points[i]);
            
            // Validate point values
            if (selectedPoints.some(point => !point?.x || !point?.fx)) {
                throw new Error("Please fill in all point values");
            }

            // Convert and validate numeric values
            const pointsData = selectedPoints.map(point => ({
                x: parseFloat(point.x),
                fx: parseFloat(point.fx)
            }));

            if (pointsData.some(point => isNaN(point.x) || isNaN(point.fx))) {
                throw new Error("All inputs must be valid numbers");
            }

            // Check for duplicate x values
            const xValues = pointsData.map(p => p.x);
            if (new Set(xValues).size !== xValues.length) {
                throw new Error("All x values must be different");
            }

            // Calculate divided differences
            const n = pointsData.length;
            const dividedDiff = Array(n).fill().map(() => Array(n).fill(0));

            // Fill in the first column with f(x) values
            for (let i = 0; i < n; i++) {
                dividedDiff[i][0] = pointsData[i].fx;
            }

            // Calculate the divided differences
            for (let j = 1; j < n; j++) {
                for (let i = 0; i < n - j; i++) {
                    dividedDiff[i][j] = (dividedDiff[i + 1][j - 1] - dividedDiff[i][j - 1]) / 
                                      (pointsData[i + j].x - pointsData[i].x);
                }
            }

            // Calculate interpolation value
            let x = parseFloat(xValue);
            let result = dividedDiff[0][0];
            let term = 1;

            for (let i = 1; i < n; i++) {
                term *= (x - pointsData[i - 1].x);
                result += (dividedDiff[0][i] * term);
            }

            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Calculation resulted in an invalid value");
            }

            setResult(result);
        } catch (error) {
            alert(error.message);
            setResult(null);
        }
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
                <div className="flex flex-wrap gap-4">
                    {points.map((_, index) => (
                        <div key={index}>
                            <label className="text-gray-500">Select Point {index + 1}</label>
                            <input
                                type="number"
                                className="block w-full my-3 p-2 border rounded-md"
                                placeholder={`Point ${index + 1} index`}
                                min={1}
                                max={points.length}
                                value={pointIndices.includes(index) ? index + 1 : ''}
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
