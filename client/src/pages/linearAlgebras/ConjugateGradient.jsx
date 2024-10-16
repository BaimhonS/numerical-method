import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fraction, transpose, norm } from "mathjs";

const ConjugateGradient = () => {
    const [matrix, setMatrix] = useState({});
    const [matrixSize, setMatrixSize] = useState(3);
    const [tolerance, setTolerance] = useState(0.0001);
    const [constants, setConstants] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);

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

    const calConjugateGradient = () => {
        const size = matrixSize;


        const A = Array.from({ length: size }, (_, i) =>
            Array.from({ length: size }, (_, j) => matrix[`a${i + 1}${j + 1}`])
        );

        const B = Array.from({ length: size }, (_, i) => constants[`x${i + 1}`]);


        let x = Array(size).fill(0); // Initial guess x = 0
        let r = B.map((bi, i) => bi - A[i].reduce((sum, aij, j) => sum + aij * x[j], 0)); // Initial residual r = B - Ax
        let d = r.slice(); // Initial search direction d = r
        let iterations = [];

        const norm = (vector) => Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        const norm_r0 = norm(r); // Initial norm of r
        let err = norm_r0; // Set initial errorc  
        let iter = 0; // Iteration counter

        while (err > tolerance && iter < 1000) {
            const Ad = A.map((row) =>
                row.reduce((sum, aij, j) => sum + aij * d[j], 0)
            );

            const r_dot_r = r.reduce((sum, ri) => sum + ri * ri, 0);
            const d_dot_Ad = d.reduce((sum, di, i) => sum + di * Ad[i], 0);

            const alpha = r_dot_r / d_dot_Ad; // Step size

            // Update x
            x = x.map((xi, i) => xi + alpha * d[i]);

            // Update r
            r = r.map((ri, i) => ri - alpha * Ad[i]);

            err = norm(r); // Calculate the new norm of r

            // Save current x for later use
            iterations.push({ iter: iter + 1, x: [...x] });

            // Update d
            const r_new_dot_r_new = r.reduce((sum, ri) => sum + ri * ri, 0);
            const beta = r_new_dot_r_new / r_dot_r;

            d = r.map((ri, i) => ri + beta * d[i]);

            iter++;
        }

        console.log("Final result:", x);
        console.log("Iterations:", iterations);
    

        setResults(iterations);
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

    const renderLastXValues = () => {
        if (!results.length) return null;

        const lastResult = results[results.length - 1].x;

        return (
            <div className="mb-5">
                <div className="flex space-x-4">
                    {lastResult.map((xi, i) => (
                        <div key={i}>
                            <span className="font-bold">{`x${i + 1}: `}</span>
                            {(xi).toFixed(6)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderResults = () => {
        return (
            <div>
                <h3 className="text-2xl mb-4">Iterations</h3>
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Iteration</th>
                            {Array.from({ length: matrixSize }, (_, i) => (
                                <th key={i} className="border px-4 py-2">{`x${i + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{result.iter}</td>
                                {result.x.map((xi, i) => (
                                    <td key={i} className="border px-4 py-2">
                                        {(xi)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Conjugate Gradient Method</h2>
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
                        onChange={(e) => setTolerance(parseFloat(e.target.value))}
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
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={calConjugateGradient}
                >
                    Calculate
                </button>

                {showResults && (
                    <>
                        {renderLastXValues()} {/* Display the final values of x1, x2, x3 */}
                        {renderResults()}
                    </>
                )}
            </div>
        </div>
    );
};

export default ConjugateGradient;
