import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const PolynomialRegression = () => {
    const [points, setPoints] = useState([{ x: '', fx: '' }]); // Dynamic points input
    const [degree, setDegree] = useState(2); // Polynomial degree
    const [coefficients, setCoefficients] = useState([]); // Coefficients for polynomial
    const [xInput, setXInput] = useState(''); // Input x value for estimation
    const [fxResult, setFxResult] = useState(null); // Result of f(x)
    const [matrixA, setMatrixA] = useState([]);
    const [matrixB, setMatrixB] = useState([]);

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

    // Calculate polynomial regression coefficients
    const calculatePolynomialRegression = () => {
        const validPoints = points
            .filter(p => p.x && p.fx)
            .map(p => [parseFloat(p.x), parseFloat(p.fx)]);

        // Update this check for the degree
        if (validPoints.length < degree + 1) {
            alert(`Please enter at least ${degree + 1} points for degree ${degree} regression.`);
            return;
        }

        // Create matrices for least squares
        const X = [];
        const Y = validPoints.map(point => point[1]);

        for (let i = 0; i < validPoints.length; i++) {
            const row = [];
            for (let j = 0; j <= degree; j++) {
                row.push(Math.pow(validPoints[i][0], j));
            }
            X.push(row);
        }

        // Calculate coefficients using normal equation (X^T * X)^(-1) * X^T * Y
        const Xt = transpose(X);
        const XtX = multiply(Xt, X);
        const XtY = multiply(Xt, Y);
        const coeffs = invert(XtX).map((row, i) => dot(row, XtY));

        setCoefficients(coeffs);
        createMatrices(validPoints); // Call to create matrices after coefficient calculation
    };

    // Estimate f(x) for a given x
    const estimateFx = () => {
        const x = parseFloat(xInput);
        if (coefficients.length > 0) {
            const estimatedY = coefficients.reduce((sum, coeff, index) => sum + coeff * Math.pow(x, index), 0);
            setFxResult(estimatedY);
        }
    };

    // Helper functions for matrix operations
    const transpose = (matrix) => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    };

    const multiply = (a, b) => {
        if (Array.isArray(b[0])) { // Matrix multiplication
            return a.map(row => b[0].map((_, colIndex) => row.reduce((sum, val, rowIndex) => sum + val * b[rowIndex][colIndex], 0)));
        } else { // Vector multiplication
            return a.map(row => row.reduce((sum, val, index) => sum + val * b[index], 0));
        }
    };

    const invert = (matrix) => {
        const n = matrix.length;
        const identity = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
        const augmented = matrix.map((row, i) => [...row, ...identity[i]]);

        for (let i = 0; i < n; i++) {
            let pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    let factor = augmented[j][i];
                    for (let k = 0; k < 2 * n; k++) {
                        augmented[j][k] -= factor * augmented[i][k];
                    }
                }
            }
        }

        return augmented.map(row => row.slice(n));
    };

    const dot = (a, b) => a.reduce((sum, val, index) => sum + val * b[index], 0);

    // Create matrixA for storing sum of xi^2, xi^3, xi^4, ...
    // and matrixB for storing sum of xi * yi, xi^2 * yi, xi^3 * yi, ...
    const createMatrices = (validPoints) => {
        const n = degree + 1;
        const matrixA = Array.from({ length: n }, () => Array(n).fill(0));
        const matrixB = Array(n).fill(0);

        // Calculate values for matrixA and matrixB
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                matrixA[i][j] = validPoints.reduce((sum, point) => sum + Math.pow(point[0], i + j), 0);
            }
            matrixB[i] = validPoints.reduce((sum, point) => sum + Math.pow(point[0], i) * point[1], 0);
        }

        // Set matrixA and matrixB for display
        setMatrixA(matrixA);
        setMatrixB(matrixB);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Polynomial Regression</h2>

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

                {/* Degree of polynomial */}
                <div>
                    <label className="text-gray-500">Order M</label>
                    <input
                        type="number"
                        min="1"
                        className="block w-full my-3 p-2 border rounded-md"
                        value={degree}
                        onChange={(e) => setDegree(parseInt(e.target.value))}
                    />
                </div>

                {/* Calculate button */}
                <button
                    onClick={calculatePolynomialRegression}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Calculate Polynomial Regression
                </button>

                <div className='flex'>
                    {/* Display matrixA */}
                    <div className="mt-5">
                        <table className="table-auto border-collapse border">
                            <tbody>
                                {matrixA.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((value, colIndex) => (
                                            <td key={colIndex} className="border border-white p-2">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Display matrixB */}
                    <div className="mt-5">
                        <table className="table-auto border-collapse border-white">
                            <tbody>
                                <tr>
                                    {matrixB.map((value, index) => (
                                        <td key={index} className="border border-white p-2 flex"> = {value}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coefficients display */}
                {coefficients.length > 0 && (
                    <div className="mt-5">
                        <p>
                            Polynomial Coefficients: {coefficients.map(coeff => coeff.toFixed(6)).join(' + ')}
                        </p>
                    </div>
                    
                )}
 

                {/* Input x value for estimation */}
                <div className='mt-5'>
                    <label className="text-gray-500">Enter x value for estimation</label>
                    <input
                        type="number"
                        className="block w-full my-3 p-2 border rounded-md"
                        value={xInput}
                        onChange={(e) => setXInput(e.target.value)}
                    />
                </div>

                {/* Estimate button */}
                <button
                    onClick={estimateFx}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md">
                    Estimate f(x)
                </button>

                {/* Result display */}
                {fxResult !== null && (
                    <div className="mt-5">
                        <p>f({xInput}) = {fxResult.toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolynomialRegression;
