import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';

const TrapezoidalRule = () => {
    const [a, setA] = useState(''); // Start of interval
    const [b, setB] = useState(''); // End of interval
    const [n, setN] = useState(''); // Number of subintervals
    const [expression, setExpression] = useState(''); // Function to integrate
    const [result, setResult] = useState(null); // Result of integration

    // Function to calculate integration using Trapezoidal Rule
    const calculateTrapezoidal = () => {
        const parsedA = parseFloat(a);
        const parsedB = parseFloat(b);
        const parsedN = parseInt(n);

        if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedN) || parsedN <= 0) {
            alert("Please enter valid values for a, b, and n.");
            return;
        }

        const h = (parsedB - parsedA) / parsedN; // Width of each subinterval
        let sum = 0;
        
        // Function evaluation at the start and end points
        const f = (x) => math.evaluate(expression, { x });
        sum += f(parsedA) / 2 + f(parsedB) / 2;

        // Calculate function values at interior points
        for (let i = 1; i < parsedN; i++) {
            sum += f(parsedA + i * h);
        }

        const trapezoidalResult = h * sum;
        setResult(trapezoidalResult);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-2xl mb-5">Trapezoidal Rule</h2>
                
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
                    placeholder="Number of subintervals n"
                />
                
                <button
                    onClick={calculateTrapezoidal}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Calculate Trapezoidal
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

export default TrapezoidalRule;
