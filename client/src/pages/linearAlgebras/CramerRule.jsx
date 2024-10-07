import React, { useState } from 'react';
import { det, fraction } from 'mathjs';
import Sidebar from '../../components/Sidebar';

const CramerRule = () => {
    const [matrixSize, setMatrixSize] = useState(3);
    const [matrix, setMatrix] = useState({});
    const [constants, setConstants] = useState({});
    const [solution, setSolution] = useState({});
    const [detAi, setDetAi] = useState({});
    const [showResults, setShowResults] = useState(false);

    const initializeMatrix = (size) => {
        let newMatrix = {};
        let newConstants = {};
        for (let i = 1; i <= size; i++) {
            for (let j = 1; j <= size; j++) {
                newMatrix[`a${i}${j}`] = '';
            }
            newConstants[`x${i}`] = '';
        }
        setMatrix(newMatrix);
        setConstants(newConstants);
    };

    const handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setMatrixSize(size);
        initializeMatrix(size);
        setShowResults(false);
    };

    const handleMatrixChange = (e) => {
        const { name, value } = e.target;
        setMatrix(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleConstantChange = (e) => {
        const { name, value } = e.target;
        setConstants(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const checkInputs = () => {
        const matrixValues = Object.values(matrix);
        const constantValues = Object.values(constants);
    
        const allMatrixEqual = matrixValues.every(val => val === matrixValues[0]);
        const allConstantsEqual = constantValues.every(val => val === constantValues[0]);
    
        if (allMatrixEqual && allConstantsEqual && matrixValues[0] === constantValues[0]) {
            const solutionValue = matrixValues[0]; 
            
            const solutions = {};
            for (let i = 1; i <= matrixSize; i++) {
                if (i === 1) {
                    solutions[`x${i}`] = solutionValue; 
                } else {
                    solutions[`x${i}`] = 0; 
                }
            }
    
            setSolution(solutions);
            setShowResults(true);
            return true; 
        }
    
        return false; 
    };

    const calculateCramersRule = () => {

        if (checkInputs()) {
            return; 
        }

        const A = [];
        const constantValues = Object.values(constants);
        const steps = {};
    
        for (let i = 1; i <= matrixSize; i++) {
            A.push([]);
            for (let j = 1; j <= matrixSize; j++) {
                A[i - 1].push(matrix[`a${i}${j}`]);
            }
        }
    
        const detA = det(A); 
    
        const solutions = {};
        for (let i = 0; i < matrixSize; i++) {
            const Ai = JSON.parse(JSON.stringify(A)); // Create a copy of A
            for (let j = 0; j < matrixSize; j++) {
                Ai[j][i] = constantValues[j]; 
            }
            const detAiValue = det(Ai); 
            solutions[`x${i + 1}`] = (detAiValue / detA).toFixed(6);
    
            steps[`x${i + 1}`] = {
                matrix: Ai,
                detAi: detAiValue,
                detA: detA
            };
        }
    
        setSolution(solutions);
        setDetAi(steps);
        setShowResults(true);
    };

    const renderMatrix = (matrix) => (
        <table className="border-collapse">
            <tbody>
                {matrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <td key={colIndex} className="border border-white px-2 py-1 text-center">
                                {value}
                            </td>
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
                <h2 className="text-3xl mb-5">Cramer's Rule</h2>

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
                    onClick={calculateCramersRule}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <div className="mt-5">
                        <h3 className="text-xl mb-3">Det</h3>
                        <div className="flex justify-center">
                            <div className="space-y-10">
                            {Object.keys(solution).map((key, index) => (
                                    <div key={index} className="flex items-center space-x-8 text-xl">
                                        <div>{key} </div>
                                        <div className="text-2xl">=</div>
                                        <div className="flex flex-col items-center ">
                                            {detAi[key] && detAi[key].matrix ? (
                                                <>
                                                    {renderMatrix(detAi[key].matrix)}
                                                    <div className="my-2 border-t border-black w-full"></div>
                                                    {renderMatrix(Object.keys(matrix).reduce((acc, curr) => {
                                                        const [i, j] = curr.slice(1).split('').map(Number);
                                                        if (!acc[i-1]) acc[i-1] = [];
                                                        acc[i-1][j-1] = matrix[curr];
                                                        return acc;
                                                    }, []))}
                                                </>
                                            ) : (
                                                <div>No matrix available</div>
                                            )}
                                        </div>
                                        <div className="text-2xl">=</div>
                                        <div className="flex flex-col items-center">
                                            {detAi[key] ? (
                                                <>
                                                    <div>{detAi[key].detAi}</div>
                                                    <div className="my-2 border-t border-black w-full"></div>
                                                    <div>{detAi[key].detA}</div>
                                                </>
                                            ) : (
                                                <div>No detAi available</div>
                                            )}
                                        </div>
                                        <div className="text-2xl">=</div>
                                        <div className="text-xl">{solution[key]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CramerRule;
