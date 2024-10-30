import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { abs } from "mathjs";
import axios from 'axios';

const JacobiIteration = () => {
    const [matrix, setMatrix] = useState({});
    const [matrixSize, setMatrixSize] = useState(3);
    const [constants, setConstants] = useState({});
    const [tolerance, setTolerance] = useState();
    const [xVector, setXVector] = useState([]);
    const [results, setResults] = useState([]); 
    const [showResults, setShowResults] = useState(false);

    const fetchExampleInput = () => {
        axios.get('http://localhost:8080/numerical-method/linear-algrebra/matrix-iteration/1')
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
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newMatrix[`a${i + 1}${j + 1}`] = '';
            }
            newConstants[`x${i + 1}`] = '';
        }
        setMatrix(newMatrix);
        setConstants(newConstants);
        setXVector([]);
        setResults([]);
    };

    const handleMatrixChange = (e) => {
        const { name, value } = e.target;
        setMatrix((prev) => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    };

    const handleConstantChange = (e) => {
        const { name, value } = e.target;
        setConstants((prev) => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    };

    const handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setMatrixSize(size);
        initializeMatrix(size);
        setShowResults(false);
    };

    const handleToleranceChange = (e) => {
        setTolerance(parseFloat(e.target.value));
    };

    const caljacobiIteration = () => {
        const size = matrixSize;
        const A = Array.from({ length: size }, (_, i) =>
            Array.from({ length: size }, (_, j) => matrix[`a${i + 1}${j + 1}`])
        );
        const B = Array.from({ length: size }, (_, i) => constants[`x${i + 1}`]);

        // Initialize X with zeros
        let X = Array(size).fill(0);
        let Xnew = Array(size).fill(0);
        let iterationResults = []; // Store results for each iteration
        let iterationsCompleted = 0;
        let converged = false;

        while (!converged) {
            let currentResult = { iteration: iterationsCompleted + 1 }; 
            converged = true; 

            for (let i = 0; i < size; i++) {
                let sum = 0;
                for (let j = 0; j < size; j++) {
                    if (i !== j) {
                        sum += A[i][j] * X[j];
                    }
                }
                Xnew[i] = (B[i] - sum) / A[i][i];
                currentResult[`X${i + 1}`] = Xnew[i];

                const error = abs((Xnew[i] - X[i]) / Xnew[i]);
                if (error > tolerance) {
                    converged = false; 
                }
            }

            iterationResults.push(currentResult);

            X = [...Xnew];
            iterationsCompleted++;
        }

        setXVector(Xnew);
        setResults(iterationResults);
        setShowResults(true);
    };

    const renderTable = () => (
        <table className="w-full table-auto border-collapse">
            <thead>
                <tr>
                    <th className="border px-4 py-2">Iteration</th>
                    {Array.from({ length: matrixSize }, (_, i) => (
                        <th key={i} className="border px-4 py-2">X{i + 1}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{result.iteration}</td>
                        {Array.from({ length: matrixSize }, (_, i) => (
                            <td key={i} className="border px-4 py-2">{result[`X${i + 1}`]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Gauss-Seidel Iteration Method</h2>
                <div className="flex justify-end px-10">
                <button
                    onClick={fetchExampleInput}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                    Get Example Input
                </button>
                </div>
                <div className="flex space-x-6">
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

                    <label className="block mb-3">
                        Error
                        <input
                            type="number"
                            className="block mt-2 p-2 border rounded-md"
                            placeholder="Error"
                            step="0.0001"
                            value={tolerance}
                            onChange={handleToleranceChange}
                        />
                    </label>
                </div>
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
                    onClick={caljacobiIteration}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <>
                    <div className="flex justify-center">
                        <p className="mb-5 mx-4">
                            X1 : {results.length > 0 ? results[results.length - 1].X1.toFixed(6) : 'N/A'}
                            </p>
                            <p className="mb-5 mx-4">
                            X2 : {results.length > 0 ? results[results.length - 1].X2.toFixed(6) : 'N/A'}
                            </p>
                            <p className="mb-5 mx-4">
                            X3 : {results.length > 0 ? results[results.length - 1].X3.toFixed(6) : 'N/A'}
                        </p>
                    </div>
                    <div>
                        {renderTable()}
                    </div>
                    </>
                )}
            </div>
            </div>
    );
};

export default JacobiIteration;
