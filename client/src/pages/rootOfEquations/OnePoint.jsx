import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar'; 
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const OnePoint = () => {
    const [equation, setEquation] = useState(''); 
    const [e, setE] = useState(); 
    const [iterations, setIterations] = useState([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [finalResult, setFinalResult] = useState(null); 

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const calculateOnePoint = async () => {
        setIsCalculating(true);
        setIterations([]);
        setFinalResult(null); 

        let iter = 1;
        let x = 1.0;
        let xi = 1.0;
        let ea = Number.MAX_VALUE;
        const newIterations = [];

        while (ea > e) {
            xi = evaluate(equation, { x });
            ea = error(x, xi);

            newIterations.push({
                iteration: iter,
                x: xi,
                error: ea,
            });

            x = xi;
            iter++;
        }

        setIterations(newIterations);
        setFinalResult(xi); 
        setShowResults(true);
        setIsCalculating(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">One-Point Method</h2>
                <div className="flex space-x-6">
                    <div>
                        <p className="text-gray-500">Equation</p>
                        <input
                            type="text"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Equation"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500">Error</p>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Error"
                            value={e}
                            onChange={(e) => setE(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                <div>
                    <button
                        onClick={calculateOnePoint}
                        className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                        Calculate
                    </button>
                </div>

                {isCalculating && (
                    <div className="flex mt-5">
                        <p>Wait calculating...</p>
                    </div>
                )}

                {showResults && !isCalculating && (
                    <div className="flex flex-col mt-5">
                        {finalResult !== null && (
                            <div className="mb-5">
                                <p className="mb-5">x = {finalResult.toFixed(6)}</p>
                            </div>
                        )}

                        {iterations.length > 0 && (
                            <div className="flex justify-center mb-5">
                                <LineChart width={1000} height={400} data={iterations}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="iteration" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="x" stroke="#122122" />
                                </LineChart>
                            </div>
                        )}

                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Iteration</th>
                                    <th className="border px-4 py-2">x</th>
                                    <th className="border px-4 py-2">Error (ea)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {iterations.map((iter, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{iter.iteration}</td>
                                        <td className="border px-4 py-2">{iter.x}</td>
                                        <td className="border px-4 py-2">{iter.error}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnePoint;
