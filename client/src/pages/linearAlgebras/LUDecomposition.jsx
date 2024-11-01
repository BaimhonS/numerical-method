import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { fraction } from 'mathjs';
import axios from 'axios';

const LUDecomposition = () => {
    const [matrixSize, setMatrixSize] = useState(3); 
    const [matrix, setMatrix] = useState({});
    const [constants, setConstants] = useState({});
    const [L, setL] = useState([]);
    const [U, setU] = useState([]);
    const [Y, setY] = useState([]);
    const [X, setX] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const fetchExampleInput = () => {
        axios.get('/numerical-method/linear-algrebra/matrix/1')
            .then((response) => {
                const data = response.data;
    
                // Extract the matrix and constant data from the response
                const matrixSize = data.matrix_size;
                const matrixValues = data.matrix_data.split(',').map(Number);
                const constantValues = data.constant_data.split(',').map(Number);
    
                // Set matrix
                let newMatrix = {};
                let index = 0;
                for (let i = 1; i <= matrixSize; i++) {
                    for (let j = 1; j <= matrixSize; j++) {
                        newMatrix[`a${i}${j}`] = matrixValues[index];
                        index++;
                    }
                }
    
                // Set constants
                let newConstants = {};
                for (let i = 1; i <= matrixSize; i++) {
                    newConstants[`x${i}`] = constantValues[i - 1];
                }
    
                // Update the state
                setMatrixSize(matrixSize); // Update matrix size
                setMatrix(newMatrix); // Set matrix values
                setConstants(newConstants); // Set constant values
                setShowResults(false); // Reset any previous results
            })
            .catch((error) => {
                console.error("There was an error fetching the example input!", error);
            });
    };

    const initializeMatrix = (size) => {
        const newMatrix = {};
        const newConstants = {};
        for (let i = 1; i <= size; i++) {
            for (let j = 1; j <= size; j++) {
                newMatrix[`a${i}${j}`] = '';
            }
            newConstants[`x${i}`] = '';
        }
        setMatrix(newMatrix);
        setConstants(newConstants);
    };

    const handleMatrixChange = (e) => {
        const { name, value } = e.target;
        setMatrix(prev => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    };

    const handleConstantChange = (e) => {
        const { name, value } = e.target;
        setConstants(prev => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    };

    const handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setMatrixSize(size);
        initializeMatrix(size);
        setShowResults(false);
    };

    const checkInput = () => {
        const matrixValues = Object.values(matrix).map(value => value === '' ? 0 : parseFloat(value));
        const constantValues = Object.values(constants).map(value => value === '' ? 0 : parseFloat(value));
    
        const firstMatrixValue = matrixValues[0];
        const firstConstantValue = constantValues[0];
    
        const allMatrixSame = matrixValues.every(val => val === firstMatrixValue);
        const allConstantsSame = constantValues.every(val => val === firstConstantValue);
    
        if (allMatrixSame && allConstantsSame) {
            const newSolution = Array(matrixSize).fill(0);
            newSolution[0] = firstConstantValue; 
            setX(newSolution); 
            setShowResults(true);
            return true; 
        }
    
        return false; 
    };

    const calLUDecomposition = () => {

        if (checkInput()) {
            return;
        }

        let A = Array.from({ length: matrixSize }, (_, i) =>
            Array.from({ length: matrixSize }, (_, j) =>
                parseFloat(matrix[`a${i + 1}${j + 1}`]) || 0
            )
        );
        let B = Array.from({ length: matrixSize }, (_, i) =>
            parseFloat(constants[`x${i + 1}`]) || 0
        );

        let L = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
        let U = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
        
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                if (i <= j) {
                    U[i][j] = A[i][j];
                    for (let k = 0; k < i; k++) {
                        U[i][j] -= L[i][k] * U[k][j];
                    }
                } else {
                    L[i][j] = A[i][j];
                    for (let k = 0; k < j; k++) {
                        L[i][j] -= L[i][k] * U[k][j];
                    }
                    L[i][j] /= U[j][j];
                }
            }
        }

        for (let i = 0; i < matrixSize; i++) {
            L[i][i] = 1;
        }

        let Y = Array(matrixSize).fill(0);
        for (let i = 0; i < matrixSize; i++) {
            Y[i] = B[i];
            for (let j = 0; j < i; j++) {
                Y[i] -= L[i][j] * Y[j];
            }
        }

        let X = Array(matrixSize).fill(0);
        for (let i = matrixSize - 1; i >= 0; i--) {
            X[i] = Y[i];
            for (let j = i + 1; j < matrixSize; j++) {
                X[i] -= U[i][j] * X[j];
            }
            X[i] /= U[i][i];
        }

        setL(L);
        setU(U);
        setY(Y);
        setX(X);
        setShowResults(true);
    };

    const renderFraction = (value) => {
        if (Number.isInteger(value)) return value;
        const frac = fraction(value);
        const sign = frac.s < 0 ? '-' : ''; 
    
        return (
            <div className="flex items-center">
                {sign && <div className="mr-1">{sign}</div>}
                <div className="flex flex-col items-center">
                    <div>{Math.abs(frac.n)}</div>
                    <div className="border-t border-black w-full"></div>
                    <div>{Math.abs(frac.d)}</div> 
                </div>
            </div>
        );
    };

    const renderMatrix = (matrix, title) => (
        <div className="mb-6">
            <h3 className="text-2xl mb-2">{title}</h3>
            <table className="border-collapse mx-auto">
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((value, colIndex) => (
                                <td key={colIndex} className="border border-white px-3 py-2 text-center">
                                    {renderFraction(value)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderEquation = (equation, values) => (
        <div className="mb-6">
            <h3 className="text-2xl mb-2">{equation}</h3>
            <div className="flex justify-center">
                {values.map((val, idx) => (
                    <div key={idx} className="mx-2 p-1 flex">
                        {equation.split(' ')[0][1].toLowerCase()}{idx + 1} = {(val).toFixed(6)}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">LU Decomposition</h2>
                <div className="flex justify-end px-10">
                <button
                    onClick={fetchExampleInput}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                    Get Example Input
                </button>
                </div>
                <label className="block mb-4">
                    Select Matrix Size
                    <select
                        className="block mt-2 p-2 border rounded-md"
                        value={matrixSize}
                        onChange={handleSizeChange}
                    >
                        <option value={2}>2 x 2</option>
                        <option value={3}>3 x 3</option>
                        <option value={4}>4 x 4</option>
                    </select>
                </label>

                <div className="flex justify-center mb-6">
                    <div>
                        {Array.from({ length: matrixSize }, (_, i) => (
                            <div key={i} className="flex mb-2">
                                {Array.from({ length: matrixSize }, (_, j) => (
                                    <input
                                        key={j}
                                        type="number"
                                        className="w-14 h-14 mx-2 my-2 text-center border rounded-md"
                                        placeholder={`a${i + 1}${j + 1}`}
                                        name={`a${i + 1}${j + 1}`}
                                        value={matrix[`a${i + 1}${j + 1}`] || ''}
                                        onChange={handleMatrixChange}
                                    />
                                ))}
                                <span className="mx-3 my-6">=</span>
                                <input
                                    type="number"
                                    className="w-14 h-14 mx-2 my-2 text-center border rounded-md"
                                    placeholder={`x${i + 1}`}
                                    name={`x${i + 1}`}
                                    value={constants[`x${i + 1}`] || ''}
                                    onChange={handleConstantChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={calLUDecomposition}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <div className="mt-10 text-xl">
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-4">
                                {renderMatrix(L, "L Matrix")}
                                {renderEquation("LY = B", Y)}
                            </div>
                            <div className="w-1/2 pl-4">
                                {renderMatrix(U, "U Matrix")}
                                {renderEquation("UX = Y", X)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LUDecomposition;
