import { evaluate } from "mathjs";
import React, { useState } from "react";
import axios from "axios";  // Import Axios
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Graphical = () => {
    const [equation, setEquation] = useState('');
    const [scan, setScan] = useState();
    const [results, setResults] = useState([]); 
    const [showResults, setShowResults] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);  
    const [finalValue, setFinalValue] = useState(null);

    const fetchExample = async () => {
        try {
            const response = await axios.get('http://localhost:8080/numerical-method/root-of-equations/graphical/1');
            const { equation, scan } = response.data;

            setEquation(equation);
            setScan(scan);
        } catch (error) {
            console.error('Error fetching example data:', error);
        }
    };

    const calGraphical = async () => {  
        setIsCalculating(true); 
        await new Promise(resolve => setTimeout(resolve, 100)); 

        let closestX;
        let closest = Number.MAX_VALUE;
        const data = []; 

        for (let x = 0.0 ; x < 10.0; x += 0.1){
            let y = evaluate(equation, {x});
            
            if (Math.abs(y) < 1) { 
                data.push({ x, y });
            }

            if (Math.abs(y) < closest) {
                closest = Math.abs(y);
                closestX = x;
            }
        }

        let yStart = closestX - 1;
        let yEnd = closestX + 1;
        closest = Number.MAX_VALUE;

        for (let x = yStart; x <= yEnd; x += scan) { 
            let y = evaluate(equation, {x});
            
            if (Math.abs(y) < 1) {
                data.push({ x, y });
            }

            if (Math.abs(y) < closest) {
                closest = Math.abs(y);
                closestX = x;
            }
        }

        setResults(data);
        setShowResults(true); 
        setIsCalculating(false);  
        setFinalValue(closestX); 
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className='flex-1 p-10'>
                <h2 className='text-3xl mb-5'>Graphical Method</h2>
                <div className="flex justify-end px-10">
                <button
                    onClick={fetchExample}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                    Get Example Input
                </button>
                </div>
                <div className='flex space-x-6'>
                    <div>
                        <p className='text-gray-500'>Equation</p>
                        <input
                            type="text"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Equation"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className='text-gray-500'>Scan</p>
                        <input
                            type="number"
                            className="block w-full my-3 p-2 border rounded-md"
                            placeholder="Scan"
                            value={scan}
                            onChange={(e) => setScan(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex space-x-6">
                    <button 
                        className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={calGraphical}
                    >
                        Calculate
                    </button>
                </div>

                {isCalculating && (
                    <div className="flex mt-5">
                        <p>Wait calculating...</p>
                    </div>
                )}

                {showResults && !isCalculating && (
                    <div>
                        <p className="mb-5">X : {finalValue ? finalValue.toFixed(6) : 'N/A'}</p>
                        <div className="flex justify-center mb-5">
                            <LineChart width={1000} height={400} data={results}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="y" stroke="#122122" />
                            </LineChart>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Graphical;
