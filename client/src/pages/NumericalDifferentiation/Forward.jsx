import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import * as math from 'mathjs';

const ForwardDividedDifference = () => {
    const [points, setPoints] = useState([{ x: '', y: '' }]); // Array to store input points
    const [result, setResult] = useState(null); // Result of forward divided difference table

    // Function to calculate the forward divided difference table
    const calculateForwardDividedDifference = () => {
        const n = points.length;
        const table = Array.from({ length: n }, () => Array(n).fill(0));

        // Populate the first column of the table with y-values
        points.forEach((point, index) => {
            table[index][0] = parseFloat(point.y);
        });

        // Calculate the divided differences
        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / 
                              (points[i + j].x - points[i].x);
            }
        }

        setResult(table);
    };

    // Function to handle adding a new point
    const addPoint = () => {
        setPoints([...points, { x: '', y: '' }]);
    };

    // Function to update x or y values in points array
    const updatePoint = (index, field, value) => {
        const updatedPoints = points.map((point, i) =>
            i === index ? { ...point, [field]: value } : point
        );
        setPoints(updatedPoints);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h2 className="text-2xl mb-5">Forward Divided Difference</h2>

                {points.map((point, index) => (
                    <div key={index} className="flex mb-3">
                        <input
                            type="number"
                            className="mr-2 p-2 border rounded-md"
                            placeholder={`x${index}`}
                            value={point.x}
                            onChange={(e) => updatePoint(index, 'x', parseFloat(e.target.value))}
                        />
                        <input
                            type="number"
                            className="p-2 border rounded-md"
                            placeholder={`y${index}`}
                            value={point.y}
                            onChange={(e) => updatePoint(index, 'y', parseFloat(e.target.value))}
                        />
                    </div>
                ))}

                <button
                    onClick={addPoint}
                    className="my-5 px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Add Point
                </button>

                <button
                    onClick={calculateForwardDividedDifference}
                    className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Calculate Forward Divided Difference
                </button>

                {/* Display the result */}
                {result && (
                    <div className="mt-5">
                        <h3 className="text-xl">Divided Difference Table:</h3>
                        <table className="w-full mt-3 border border-collapse">
                            <thead>
                                <tr>
                                    {Array.from({ length: points.length }).map((_, index) => (
                                        <th key={index} className="border p-2">
                                            Δ^{index} y
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((value, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="border p-2 text-center"
                                            >
                                                {colIndex <= points.length - rowIndex - 1
                                                    ? value.toFixed(6)
                                                    : ''}
                                            </td>
                                        ))}
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

export default ForwardDividedDifference;
