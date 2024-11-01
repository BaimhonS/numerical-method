import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';
import axios from 'axios';

const TrapezoidalRule = () => {
    const [a, setA] = useState(''); // Start of interval
    const [b, setB] = useState(''); // End of interval
    const [n, setN] = useState(''); // Number of subintervals
    const [expression, setExpression] = useState(''); // Function to integrate
    const [result, setResult] = useState(null); // Result of integration
    const fetchExampleInput = () => {
        axios.get('/numerical-method/integration/trapezoid/1')
            .then((response) => {
                const data = response.data;
                
                setExpression(data.function);
                setA(data.lower.toString());
                setB(data.upper.toString());
                setN(data.interval.toString());
            })
            .catch((error) => {
                console.error("Error fetching example input:", error);
            });
    };

    // Function to calculate integration using Trapezoidal Rule
    const calculateTrapezoidal = () => {
        try {
            const parsedA = parseFloat(a);
            const parsedB = parseFloat(b);
            const parsedN = parseInt(n);

            if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedN) || parsedN <= 0) {
                alert("Please enter valid values for a, b, and n.");
                return;
            }

            const h = (parsedB - parsedA) / parsedN;
            let sum = 0;
            
            const f = (x) => {
                try {
                    const result = math.evaluate(expression, { x });
                    if (isNaN(result)) {
                        throw new Error('Invalid result');
                    }
                    return result;
                } catch (error) {
                    throw new Error('Invalid function expression');
                }
            };

            try {
                // Function evaluation at the start and end points
                const fa = f(parsedA);
                const fb = f(parsedB);
                sum += fa / 2 + fb / 2;

                // Calculate function values at interior points
                for (let i = 1; i < parsedN; i++) {
                    const value = f(parsedA + i * h);
                    sum += value;
                }

                const trapezoidalResult = h * sum;
                
                if (isNaN(trapezoidalResult)) {
                    throw new Error('Invalid result');
                }
                
                setResult(trapezoidalResult);
            } catch (error) {
                throw error; // Re-throw to be caught by outer try-catch
            }
        } catch (error) {
            alert(`Calculation error: ${error.message}`);
            setResult(null);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-2xl mb-5">Trapezoidal Rule</h2>
                <div className="flex justify-end">
                    <button
                        onClick={fetchExampleInput}
                        className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                        Get Example
                    </button>
                </div>
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
