import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';

const MultipleLinearRegression = () => {
    const [points, setPoints] = useState([{ x: [], fx: '' }]);
    const [coefficients, setCoefficients] = useState([]);
    const [xInputs, setXInputs] = useState([]);
    const [predictedFx, setPredictedFx] = useState(null);
    const [sumXiYi, setSumXiYi] = useState([]); // sum(xi*yi)
    const [sumXi, setSumXi] = useState([]); // sum(xi)
    const [sumXiXj, setSumXiXj] = useState([]); // sum(xi*xj)
    const [sumY, setSumY] = useState(0); // sum(y)

    const handlePointChange = (index, field, value) => {
        const newPoints = [...points];
        newPoints[index][field] = value;
        setPoints(newPoints);
        calculateSums(); // Recalculate sums when points change
    };

    const handleXValueChange = (pointIndex, xIndex, value) => {
        const newPoints = [...points];
        newPoints[pointIndex].x[xIndex] = value;
        setPoints(newPoints);
        calculateSums(); // Recalculate sums when points change
    };

    const addPoint = () => {
        setPoints([...points, { x: new Array(points[0].x.length).fill(''), fx: '' }]);
    };

    const removePoint = (index) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        calculateSums(); // Recalculate sums after removing point
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

    const calculateSums = () => {
        const validPoints = points.filter(p => p.x.every(x => x) && p.fx)
            .map(p => [...p.x.map(parseFloat), parseFloat(p.fx)]);
        
        const n = validPoints.length;
        const numVars = points[0].x.length;

        // Calculate sum(y)
        const sumYValue = validPoints.reduce((sum, point) => sum + point[point.length - 1], 0);
        setSumY(sumYValue);

        // Calculate sum(xi)
        const sumXiValues = Array(numVars).fill(0);
        for (let i = 0; i < numVars; i++) {
            sumXiValues[i] = validPoints.reduce((sum, point) => sum + point[i], 0);
        }
        setSumXi(sumXiValues);

        // Calculate sum(xi*yi)
        const sumXiYiValues = Array(numVars).fill(0);
        for (let i = 0; i < numVars; i++) {
            sumXiYiValues[i] = validPoints.reduce((sum, point) => 
                sum + point[i] * point[point.length - 1], 0);
        }
        setSumXiYi(sumXiYiValues);

        // Calculate sum(xi*xj)
        const sumXiXjMatrix = Array(numVars).fill().map(() => Array(numVars).fill(0));
        for (let i = 0; i < numVars; i++) {
            for (let j = 0; j < numVars; j++) {
                sumXiXjMatrix[i][j] = validPoints.reduce((sum, point) => 
                    sum + point[i] * point[j], 0);
            }
        }
        setSumXiXj(sumXiXjMatrix);
    };

    const calculateMultipleLinearRegression = () => {
        const numVars = points[0].x.length;
        const validPoints = points.filter(p => p.x.every(x => x) && p.fx);
        const n = validPoints.length;

        if (n < numVars + 1) {
            alert(`Please enter at least ${numVars + 1} points for multiple linear regression.`);
            return;
        }

        calculateSums();

        // Create the system of equations matrix
        const matrix = Array(numVars + 1).fill().map(() => Array(numVars + 2).fill(0));
        
        // First row
        matrix[0][0] = n;
        for (let i = 0; i < numVars; i++) {
            matrix[0][i + 1] = sumXi[i];
        }
        matrix[0][numVars + 1] = sumY;

        // Remaining rows
        for (let i = 0; i < numVars; i++) {
            matrix[i + 1][0] = sumXi[i];
            for (let j = 0; j < numVars; j++) {
                matrix[i + 1][j + 1] = sumXiXj[i][j];
            }
            matrix[i + 1][numVars + 1] = sumXiYi[i];
        }

        // Solve using mathjs
        const coefficientMatrix = matrix.map(row => row.slice(0, -1));
        const constantVector = matrix.map(row => row[row.length - 1]);
        const solution = math.lusolve(coefficientMatrix, constantVector);
        
        setCoefficients(solution.map(x => x[0]));
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
                    <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-bold mb-4">System of Equations (AX = B):</h3>
                        
                        {/* Matrix A */}
                        <div className="flex items-center mb-4">
                  
                            <div>
                                {/* First row with n and sumXi values */}
                                <div className="flex mb-2">
                                    <span className="w-20 text-right">{points.filter(p => p.x.every(x => x) && p.fx).length}</span>
                                    {sumXi.map((x, i) => (
                                        <span key={i} className="w-20 text-right">{x.toFixed(2)}</span>
                                    ))}
                                </div>
                                
                                {/* Remaining rows with sumXi and sumXiXj values */}
                                {sumXi.map((_, rowIndex) => (
                                    <div key={rowIndex} className="flex mb-2">
                                        <span className="w-20 text-right">{sumXi[rowIndex].toFixed(2)}</span>
                                        {sumXiXj[rowIndex].map((value, colIndex) => (
                                            <span key={colIndex} className="w-20 text-right">
                                                {value.toFixed(2)}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        

                            {/* Matrix X */}
                            <div className="mx-4 flex items-center">
                             
                                <div>
                                    <div className="mb-2">x</div>
                                    {coefficients.slice(1).map((_, i) => (
                                        <div key={i} className="mb-2">x{i + 1}</div>
                                    ))}
                                </div>
                                
                            </div>

                            <div className="mx-2">=</div>

                            {/* Matrix B */}
                            <div className="flex items-center">
                              
                                <div>
                                    <div className="mb-2">{sumY.toFixed(2)}</div>
                                    {sumXiYi.map((value, i) => (
                                        <div key={i} className="mb-2">{value.toFixed(2)}</div>
                                    ))}
                                </div>
                     
                            </div>
                        </div>

                        {/* Solution */}
                        <div className="mt-6">
                            <h3 className="font-bold mb-2">Solution:</h3>
                            <div className="flex items-center">
                           
                                <div>
                                    {coefficients.map((coef, i) => (
                                        <div key={i} className="mb-2">
                                            x{i} = {coef.toFixed(4)}
                                        </div>
                                    ))}
                                </div>
                            
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleLinearRegression;