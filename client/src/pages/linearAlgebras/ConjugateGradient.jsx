import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fraction } from "mathjs";

const ConjugateGradient = () => {
    const [matrix , setMatrix] = useState({});
    const [matrixSize , setMatrixsize] = useState(3);
    const [constants , setConstants] = useState({});
    const [showResults , setShowResults] = useState(false);

    const inintializeMatrix = (size) => {
        const newMatrix = {};
        const newConstants = {};

        for (let i = 0 ; i < size; i++){
            for (let j = 0; j < size; j++){
                newMatrix[`a${i}${j}`] = '';
            }
            newConstants[`x${i}`] = '';
        }
        setMatrix(newMatrix);
        setConstants(newConstants);
    };
    
    const handleMatrixChange = (e) => {
        const {name , value}= e.target;
        setMatrix(prev => ({...prev , [name]: value ? parseFloat(value) : ''}))
    };

    const handleConstantChange = (e) => {
        const {name , value}= e.target;
        setConstants(prev => ({...prev , [name]: value ? parseFloat(value) : ''}))
    };

    const handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setMatrixsize(size);
        inintializeMatrix(size);
        showResults(false);
    };

    const calGaussConjugateGradient = () => {

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
                    <div className="border-t border-black w-full"></div> {/* Fraction bar */}
                    <div>{Math.abs(frac.d)}</div> 
                </div>
            </div>
        );
    };

    const renderMatrix = (matrix) => {
        <table className="border-collapse ma-auto">
            <tbody>
                {matrix.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border border-white px-3 py-1 text-center text-xl">
                        {renderFraction(value)}
                    </tr>
                ))}
            </tbody>
        </table>
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-10">
                <h2 className="text-3xl mb-5">Matrix Inverse</h2>

                <label className="block mb-4">
                    Select Matrix Size:

                    <select 
                        className="block mt-2 p-2 border rounded-md"
                        value={matrixSize}
                        // onChange={}
                    >
                        <option value={2}>2 x 2</option>
                        <option value={3}>3 x 3</option>
                        <option value={4}>4 x 4</option>
                    </select>
                </label>

                <div className="flex justify-center mb-6">
                    <div>
                        {Array.from({ lenght: matrixSize}, (_,i) => (
                            <div key={i} className="flex mb-2">
                                {Array.from({ length: matrixSize}, (_,j) => (
                                    <input
                                        key={j} 
                                        type="number" 
                                        className="w-14 h-14 mx-2 my-2 text-center border rounded-md"
                                        placeholder={`a${i + 1}${j + 1}`}
                                        name={`a${i + 1}${j + 1}`}
                                        value={matrix[`a${i + 1}${j + 1}`] || ''}
                                        // onChange={}
                                    />
                                ))}

                                <span className="mx-3 my-4">=</span>
                                <input 
                                    type="number" 
                                    className="w-14 h-14 mx-2 my-2 text-center border rounded-md"
                                    placeholder={`x${i + 1}`}
                                    name={`x${i + 1}`}
                                    value={constants[`x${i + 1}`] || ''}
                                    // onChange={}                               
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        // onClick={calConjugateGradient}
                        className="my-5 mx-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Calculate
                    </button>   
                    
                    {showResults && (
                        <div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConjugateGradient;