import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';

const MultipleLinearRegression = () => {
    const [points, setPoints] = useState([{ x: [], fx: '' }]);
    const [coefficients, setCoefficients] = useState([]);
    const [xInputs, setXInputs] = useState([]);
    const [predictedFx, setPredictedFx] = useState(null);
    const [sumXiYi, setSumXiYi] = useState([]); // New state for sum(xi*yi)

    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
        calculateSumXiYi(); // Recalculate sums when points change
    };

    const handleXValueChange = (pointIndex, xIndex, value) => {
        const newPoints = [...points];
        newPoints[pointIndex].x[xIndex] = value;
        setPoints(newPoints);
        calculateSumXiYi(); // Recalculate sums when points change
    };

    const addPoint = () => {
        setPoints([...points, { x: new Array(points[0].x.length).fill(''), fx: '' }]);
    };

    const removePoint = (index) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        calculateSumXiYi(); // Recalculate sums after removing point
    };

    const addVariable = () => {
        setPoints(points.map(point => ({
            ...point,
            x: [...point.x, '']
        })));
        setXInputs([...xInputs, '']);
        setSumXiYi([...sumXiYi, 0]); // Add new sum for new variable
    };

    const removeVariable = () => {
        if (points[0].x.length > 1) {
            setPoints(points.map(point => ({
                ...point,
                x: point.x.slice(0, -1)
            })));
            setXInputs(xInputs.slice(0, -1));
            setSumXiYi(sumXiYi.slice(0, -1)); // Remove last sum
        }
    };

    // New function to calculate sum(xi*yi) for each variable
    const calculateSumXiYi = () => {
        const validPoints = points.filter(p => p.x.every(x => x) && p.fx)
            .map(p => [...p.x.map(parseFloat), parseFloat(p.fx)]);

        const sums = points[0].x.map((_, xIndex) => {
            return validPoints.reduce((sum, point) => {
                const xi = parseFloat(point[xIndex]) || 0;
                const yi = parseFloat(point[point.length - 1]) || 0;
                return sum + (xi * yi);
            }, 0);
        });

        setSumXiYi(sums);
    };

    const calculateMultipleLinearRegression = () => {
        const validPoints = points.filter(p => p.x.every(x => x) && p.fx)
            .map(p => [...p.x.map(parseFloat), parseFloat(p.fx)]);

        if (validPoints.length < points[0].x.length + 1) {
            alert(`Please enter at least ${points[0].x.length + 1} points for multiple linear regression.`);
            return;
        }

        const X = validPoints.map(point => [1, ...point.slice(0, -1)]);
        const Y = validPoints.map(point => point[point.length - 1]);

        const XT = math.transpose(X);
        const XTX = math.multiply(XT, X);
        const XTX_inv = math.inv(XTX);
        const XTY = math.multiply(XT, Y);
        const B = math.multiply(XTX_inv, XTY);

        setCoefficients(B);
        calculateSumXiYi(); // Calculate sums after regression
    };

    const predictFx = () => {
        if (coefficients.length === 0) {
            alert('Please calculate the regression coefficients first.');
            return;
        }
        const prediction = coefficients.reduce(
            (sum, coef, index) => sum + coef * (index === 0 ? 1 : parseFloat(xInputs[index - 1] || 0)),
            0
        );
        setPredictedFx(prediction);
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Multiple Linear Regression</h2>

                <div>
                    {points.map((point, index) => (
                        <div key={index} className="mb-3">
                            <label>Point {index + 1}:</label>
                            {point.x.map((xValue, xIndex) => (
                                <input
                                    key={xIndex}
                                    type="number"
                                    className="mx-2 p-2 border rounded-md"
                                    placeholder={`x${xIndex + 1}`}
                                    value={xValue}
                                    onChange={(e) => handleXValueChange(index, xIndex, e.target.value)}
                                />
                            ))}
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
                                    className="mx-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className='space-x-5'>
                    <button onClick={addPoint} className="my-3 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                        Add Point
                    </button>
                    <button onClick={addVariable} className="my-3 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                        Add Variable
                    </button>
                    {points[0].x.length > 1 && (
                        <button onClick={removeVariable} className="my-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Remove Last Variable
                        </button>
                    )}
                    <button onClick={calculateMultipleLinearRegression} className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Calculate Coefficients
                    </button>
                </div>

                

                <div>
                    {xInputs.map((input, index) => (
                        <div key={index}>
                            <label className="text-gray-500">Enter x{index + 1} value for prediction</label>
                            <input
                                type="number"
                                className="block w-full my-3 p-2 border rounded-md"
                                value={input}
                                onChange={(e) => {
                                    const newInputs = [...xInputs];
                                    newInputs[index] = e.target.value;
                                    setXInputs(newInputs);
                                }}
                            />
                        </div>
                    ))}
                </div>

                <button onClick={predictFx} className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Predict f(x)
                </button>

                {predictedFx !== null && (
                    <div className="mt-5 p-4 rounded-lg">
                        <p>Predicted f(x): {predictedFx.toFixed(6)}</p>
                    </div>
                )}
                {coefficients.length > 0 && (
                    <div className="mt-5 p-4 rounded-lg">
                        <p>Coefficients: {coefficients.map(c => c.toFixed(6)).join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleLinearRegression;