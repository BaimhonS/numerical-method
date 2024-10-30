import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FalsePosition = () => {
    const [equation, setEquation] = useState('');
    const [xl, setXl] = useState('');
    const [xr, setXr] = useState('');
    const [E, setE] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false); 

    const fetchExampleInput = () => {
        axios.get('http://localhost:8080/numerical-method/root-of-equations/false-position/1')
            .then((response) => {
                const data = response.data;
                setEquation(data.equation);
                setXl(data.xl);
                setXr(data.xr);
                setE(data.e);
            })
            .catch((error) => {
                console.error("There was an error fetching the example input!", error);
            });
    };

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const calFalsePosition = () => {
        let Xl = parseFloat(xl);
        let Xr = parseFloat(xr);
        let xm, fXm, fXr, fXl, ea;
        let iter = 0;
        const data = [];
    
        do {
            const scopeXl = { x: Xl };
            const scopeXr = { x: Xr };
    
            fXl = evaluate(equation, scopeXl);
            fXr = evaluate(equation, scopeXr);
    
            xm = Xr - (fXr * (Xl - Xr)) / (fXl - fXr);
    
            const scopeXm = { x: xm };
            fXm = evaluate(equation, scopeXm);
    
            iter++;
    
            if (fXm * fXr > 0) {
                ea = error(Xr, xm); 
                data.push({ 
                    iteration: iter, 
                    Xl: Xl, 
                    Xm: xm, 
                    Xr: Xr,
                });
                Xr = xm;
            } else {
                ea = error(Xl, xm);
                data.push({ 
                    iteration: iter, 
                    Xl: Xl, 
                    Xm: xm, 
                    Xr: Xr,
                });
                Xl = xm;
            }
        } while (ea > E && iter < 50);
    
        setResults(data);
        setShowResults(true); 
    };
    

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">False Position Method</h2>
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
                        <label className="text-gray-500">Xl</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Xl"
                            value={xl}
                            onChange={(e) => setXl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Xr</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Xr"
                            value={xr}
                            onChange={(e) => setXr(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Error</label>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Error"
                            value={E}
                            onChange={(e) => setE(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={calFalsePosition}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Calculate
                </button>

                {showResults && (
                    <div className="mt-5">
                        <p className="mb-5">X : {results.length > 0 ? results[results.length - 1].Xm.toFixed(6) : 'N/A'}</p>
                        <div className="flex justify-center">
                            <LineChart width={1000} height={400} data={results}>
                                <CartesianGrid strokeDasharray="" />
                                <XAxis dataKey="iteration" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Xm" stroke="#122122" />
                            </LineChart>
                        </div>
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Iteration</th>
                                    <th className="border px-4 py-2">Xl</th>
                                    <th className="border px-4 py-2">Xm</th>
                                    <th className="border px-4 py-2">Xr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{result.iteration}</td>
                                        <td className="border px-4 py-2">{result.Xl}</td>
                                        <td className="border px-4 py-2">{result.Xm}</td>
                                        <td className="border px-4 py-2">{result.Xr}</td>
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

export default FalsePosition;