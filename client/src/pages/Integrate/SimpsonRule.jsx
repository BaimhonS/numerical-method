import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';

const SimpsonRule = () => {
    const [a, setA] = useState(''); // Start of interval
    const [b, setB] = useState(''); // End of interval
    const [n, setN] = useState(''); // Number of subintervals (must be even for Simpson's Rule)
    const [expression, setExpression] = useState(''); // Function to integrate
    const [result, setResult] = useState(null); // Result of integration

    // Function to calculate integration using Simpson's Rule
    const calculateSimpson = () => {
        const parsedA = parseFloat(a);
        const parsedB = parseFloat(b);
        let parsedN = parseInt(n);

        if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedN) || parsedN <= 0 || parsedN % 2 !== 0) {
            alert("Please enter valid values for a, b, and an even n.");
            return;
        }

        const h = (parsedB - parsedA) / parsedN; // Width of each subinterval
        const f = (x) => math.evaluate(expression, { x });
        
        // Apply Simpson's Rule formula
        let sum = f(parsedA) + f(parsedB);

        for (let i = 1; i < parsedN; i++) {
            const coefficient = i % 2 === 0 ? 2 : 4;
            sum += coefficient * f(parsedA + i * h);
        }

        const simpsonResult = (h / 3) * sum;
        setResult(simpsonResult);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-2xl mb-5">Simpson's Rule</h2>
                
                <label>Function:</label>
                <input
                    type="text"
                    className="block w-full mb-3 p-2 border rounded-md"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="Enter a function, e.g., x^2 + 3"
                />
                
                <label>Start (a):</label>
                <input
                    type="number"
                    className="block w-full mb-3 p-2 border rounded-md"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="Start of interval a"
                />
                
                <label>End (b):</label>
                <input
                    type="number"
                    className="block w-full mb-3 p-2 border rounded-md"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="End of interval b"
                />
                
                <label>Number of Subintervals (n):</label>
                <input
                    type="number"
                    className="block w-full mb-3 p-2 border rounded-md"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    placeholder="Number of subintervals n (even)"
                />
                
                <button
                    onClick={calculateSimpson}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Calculate Simpson's Rule
                </button>

                {/* Display the result */}
                {result !== null && (
                    <div className="mt-5">
                        <p>Approximate Integral Result: {result.toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpsonRule;
