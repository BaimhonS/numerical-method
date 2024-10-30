import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from 'axios'
import { fraction } from "mathjs";

const CholeskyDecomposition = () => {
    const [matrix, setMatrix] = useState({});
    const [matrixSize, setMatrixSize] = useState(3);
    const [lMatrix, setLMatrix] = useState([]);
    const [lTranspose, setLTranspose] = useState([]);
    const [constants, setConstants] = useState({});
    const [yVector, setYVector] = useState([]);
    const [xVector, setXVector] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const fetchExampleInput = () => {
        axios.get('http://localhost:8080/numerical-method/linear-algrebra/matrix/1')
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
        setLMatrix([]);
        setLTranspose([]);
        setYVector([]);
        setXVector([]);
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

    const calculateCholesky = () => {
        const size = matrixSize;
        const inputMatrix = Array.from({ length: size }, (_, i) =>
            Array.from({ length: size }, (_, j) => matrix[`a${i + 1}${j + 1}`])
        );
        const inputConstants = Array.from({ length: size }, (_, i) => constants[`x${i + 1}`]);
        
        const L = choleskyDecomposition(inputMatrix);
        if (!L) {
            alert("Matrix is not positive-definite");
            return;
        }
        const LT = transpose(L);
        const Y = forwardSubstitution(L, inputConstants);
        const X = backwardSubstitution(LT, Y);

        setLMatrix(L);
        setLTranspose(LT);
        setYVector(Y);
        setXVector(X);
        setShowResults(true);
    };

    const choleskyDecomposition = (matrix) => {
        const n = matrix.length;
        const L = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                for (let k = 0; k < j; k++) {
                    sum += L[i][k] * L[j][k];
                }
                if (i === j) {
                    L[i][j] = Math.sqrt(matrix[i][i] - sum);
                } else {
                    L[i][j] = (matrix[i][j] - sum) / L[j][j];
                }
            }
        }
        return L;
    };

    const transpose = (matrix) => {
        const n = matrix.length;
        const m = matrix[0].length;
        const transposed = Array.from({ length: m }, () => Array(n).fill(0));

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                transposed[i][j] = matrix[j][i];
            }
        }

        return transposed;
    };

    const forwardSubstitution = (L, B) => {
        const n = L.length;
        const Y = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i][j] * Y[j];
            }
            Y[i] = (B[i] - sum) / L[i][i];
        }
        return Y;
    };

    const backwardSubstitution = (LT, Y) => {
        const n = LT.length;
        const X = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += LT[i][j] * X[j];
            }
            X[i] = (Y[i] - sum) / LT[i][i];
        }
        return X;
    };

    const renderFraction = (value) => {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return 'Invalid';
        }
        if (Number.isInteger(value)) return value;
        try {
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
        } catch (error) {
            console.error('Error rendering fraction:', error);
            return 'Error';
        }
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

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Cholesky Decomposition</h2>
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
                    onClick={calculateCholesky}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <div>
                        {renderMatrix(lMatrix, "L Matrix")}
                        {renderMatrix(lTranspose, "L^T Matrix")}
                        {renderMatrix([yVector], "Y Vector")}
                        {renderMatrix([xVector], "X Vector")}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CholeskyDecomposition;
