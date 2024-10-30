import React, { useState } from 'react';
import { evaluate, derivative } from 'mathjs';
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const NewtonRaphson = () => {
    const [equation, setEquation] = useState(''); 
    const [X0, setX0] = useState('');
    const [E, setError] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const fetchExampleInput = () => {
        axios.get('http://localhost:8080/numerical-method/root-of-equations/newton-raphson/1')
        .then((response) => {
            const data = response.data;
            setEquation(data.equation);
            setX0(data.x0);
            setError(data.e);
        })
        .catch((error) => {
            console.error("There was an error fetching the example input!", error);
        });
    }

    const error = (xnew, xold) => Math.abs((xnew - xold) / xnew) * 100;

    const calNewtonRaphson = () => {
        let xi = parseFloat(X0);
        let e = parseFloat(E);
        let xnew, fX, fPrimeX, ea = 100;
        let iter = 0;
        const data = [];

        do {
            fX = evaluate(equation, { x: xi });
            const fPrime = derivative(equation, 'x');
            fPrimeX = fPrime.evaluate({ x: xi });

            xnew = xi - fX / fPrimeX;

            iter++;
            ea = error(xnew, xi);
            data.push({
                iteration: iter,
                Xold: xi,
                Xnew: xnew,
                error: ea,
            });

            xi = xnew; 
        } while (ea > e && iter < 50);

        setResults(data);
        setShowResults(true);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Newton-Raphson Method</h2>
                <div className="flex justify-end px-10">
                <button
                    onClick={fetchExampleInput}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                    Get Example Input
                </button>
                </div>
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
                            value={X0}
                            onChange={(e) => setX0(e.target.value)}
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
                    onClick={calNewtonRaphson}
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
                                    <th className="border px-4 py-2">Xold</th>
                                    <th className="border px-4 py-2">Xnew</th>
                                    <th className="border px-4 py-2">Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{result.iteration}</td>
                                        <td className="border px-4 py-2">{result.Xold}</td>
                                        <td className="border px-4 py-2">{result.Xnew}</td>
                                        <td className="border px-4 py-2">{result.error.toFixed(6)}</td>
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

export default NewtonRaphson;