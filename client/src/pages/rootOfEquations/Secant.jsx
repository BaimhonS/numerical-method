import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Secant = () => {
    const [equation, setEquation] = useState('');
    const [x0, setX0] = useState(); 
    const [x1, setX1] = useState(); 
    const [E, setError] = useState();
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const error = (xnew, xold) => Math.abs((xnew - xold) / xnew) * 100;

    const calSecant = () => {
        let xOld = parseFloat(x1);
        let xPrev = parseFloat(x0);
        let e = parseFloat(E);
        let xnew, fXOld, fXPrev, ea = 100;
        let iter = 0;
        const data = [];
    
        do {
            fXOld = evaluate(equation, { x : xOld });
            fXPrev = evaluate(equation, { x : xPrev });

            xnew = xOld - fXOld * (xOld - xPrev) / (fXOld - fXPrev);

            iter++;
            ea = error(xnew, xOld); 
            data.push({
                iteration: iter,
                Xold: xOld,
                Xprev: xPrev,
                Xnew: xnew,
                error: ea,
            });

            xPrev = xOld;
            xOld = xnew;

        } while (ea > e);

        setResults(data);
        setShowResults(true);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Secant Method</h2>
                <div className="flex space-x-6">
                    <div>
                        <label className="text-gray-500">Equation</label>
                        <input
                            type="text"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Equation"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">X0</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="X0"
                            value={x0}
                            onChange={(e) => setX0(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">X1</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="X1"
                            value={x1}
                            onChange={(e) => setX1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Error</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Error"
                            value={E}
                            onChange={(e) => setError(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={calSecant}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <div className="mt-5">
                        <p className="mb-5">X : {results.length > 0 ? results[results.length - 1].Xnew.toFixed(6) : 'N/A'}</p>
                        <div className="flex justify-center mb-5">
                            <LineChart width={1000} height={400} data={results}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="iteration" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Xnew" stroke="#122122" />
                            </LineChart>
                        </div>

                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Iteration</th>
                                    <th className="border px-4 py-2">Xprev</th>
                                    <th className="border px-4 py-2">Xold</th>
                                    <th className="border px-4 py-2">Xnew</th>
                                    <th className="border px-4 py-2">Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{result.iteration}</td>
                                        <td className="border px-4 py-2">{result.Xprev}</td>
                                        <td className="border px-4 py-2">{result.Xold}</td>
                                        <td className="border px-4 py-2">{result.Xnew}</td>
                                        <td className="border px-4 py-2">{result.error}</td>
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

export default Secant;