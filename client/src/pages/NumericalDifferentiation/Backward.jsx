import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { evaluate } from "mathjs";

const BackwardDividedDifference = () => {
  const [fx, setFx] = useState("");
  const [x, setX] = useState('');
  const [h, setH] = useState('');
  const [order, setOrder] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([]);

  const handleFxChange = (e) => {
    setFx(e.target.value);
  };

  const handleXChange = (e) => {
    setX(parseFloat(e.target.value));
  };

  const handleHChange = (e) => {
    setH(parseFloat(e.target.value));
  };

  const handleOrderChange = (e) => {
    setOrder(parseInt(e.target.value));
  };

  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const calculateBackwardDividedDifference = () => {
    try {
      const expression = fx.replace(/e\^x/gi, 'exp(x)');
      
      if (order === 1) {
        // Simple backward difference for first order
        const fx_value = evaluate(expression, { x: x });
        const fxh_value = evaluate(expression, { x: x - h }); // Changed to x - h
        
        // Backward difference formula: [f(x) - f(x - h)] / h
        const approx = (fx_value - fxh_value) / h;
        
        const currentSteps = [
          {
            xValue: x,
            fxValue: fx_value,
            description: "f(x)"
          },
          {
            xValue: x - h, // Changed to x - h
            fxValue: fxh_value,
            description: "f(x - h)" // Changed description
          }
        ];

        setResult(approx);
        setSteps(currentSteps);
        setShowSteps(true);
      } else {
        // Higher order calculations
        let coefficients = [];
        for (let i = 0; i <= order; i++) {
          coefficients[i] = Math.pow(-1, i) * factorial(order) / 
            (factorial(i) * factorial(order - i));
        }

        let terms = [];
        let currentSteps = [];
        
        for (let i = 0; i <= order; i++) {
          const xValue = x - i * h; // Changed to subtract h
          const fxValue = evaluate(expression, { x: xValue });
          const coefficient = coefficients[i];
          const term = coefficient * fxValue / Math.pow(h, order);
          terms.push(term);

          currentSteps.push({
            xValue: xValue,
            fxValue: fxValue,
            coefficient: coefficient,
            term: term
          });
        }

        const approx = terms.reduce((sum, term) => sum + term, 0);
        setResult(approx);
        setSteps(currentSteps);
        setShowSteps(true);
      }
    } catch (error) {
      alert("Error in calculation. Please use 'exp(x)' for exponential function.");
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl mb-5">Backward Divided Difference</h2>
        
        <div className="flex space-x-6">
          <div>
            <label className="text-gray-500">Function f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={handleFxChange}
              className="block w-full my-3 p-2 border rounded-md"
              placeholder="Enter function (e.g., x^2, exp(x))"
            />
            <small className="text-gray-500">Use 'exp(x)' for exponential function</small>
          </div>
          <div>
            <label className="text-gray-500">x value</label>
            <input
              type="number"
              value={x}
              onChange={handleXChange}
              className="block w-full my-3 p-2 border rounded-md"
              placeholder="x value"
            />
          </div>
          <div>
            <label className="text-gray-500">Step size (h)</label>
            <input
              type="number"
              value={h}
              onChange={handleHChange}
              className="block w-full my-3 p-2 border rounded-md"
              step="0.1"
              placeholder="Step size"
            />
          </div>
          <div>
            <label className="text-gray-500">Order of Derivative</label>
            <input
              type="number"
              value={order}
              onChange={handleOrderChange}
              className="block w-full my-3 p-2 border rounded-md"
              min="1"
              placeholder="Order"
            />
          </div>
        </div>

        <button
          onClick={calculateBackwardDividedDifference}
          className="my-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Calculate
        </button>

        {showSteps && (
          <div className="mt-5">
            <p className="mb-5">Result: f{`${"′".repeat(order)}`}({x}) ≈ {result?.toFixed(6)}</p>
            
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Step</th>
                  <th className="border px-4 py-2">x Value</th>
                  <th className="border px-4 py-2">f(x)</th>
                  {order > 1 && <th className="border px-4 py-2">Coefficient</th>}
                  {order > 1 && <th className="border px-4 py-2">Term</th>}
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{step.xValue.toFixed(4)}</td>
                    <td className="border px-4 py-2">{step.fxValue.toFixed(6)}</td>
                    {order > 1 && step.coefficient && <td className="border px-4 py-2">{step.coefficient.toFixed(6)}</td>}
                    {order > 1 && step.term && <td className="border px-4 py-2">{step.term.toFixed(6)}</td>}
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

export default BackwardDividedDifference; 