import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { evaluate } from "mathjs";
import axios from 'axios';

const ForwardDividedDifference = () => {
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const [fx, setFx] = useState("");
  const [x, setX] = useState('');
  const [h, setH] = useState('');
  const [order, setOrder] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([]);

  const handleXChange = (e) => {
    const value = e.target.value;
    if (value === '' || isNaN(value)) {
      setX('');
    } else {
      setX(parseFloat(value));
    }
  };

  const handleHChange = (e) => {
    const value = e.target.value;
    if (value === '' || isNaN(value)) {
      setH('');
    } else {
      setH(parseFloat(value));
    }
  };

  const handleOrderChange = (e) => {
    const value = e.target.value;
    if (value === '' || isNaN(value)) {
      setOrder('');
    } else {
      setOrder(parseInt(value));
    }
  };

  const handleFxChange = (e) => {
    setFx(e.target.value);
  };

  const fetchExampleInput = () => {
    axios.get('/numerical-method/numerical-diff/1')
        .then((response) => {
            const data = response.data;
            
            // Convert e(x) to exp(x) for mathjs compatibility
            const functionExpression = data.function.replace('e(x)', 'exp(x)');
            
            setFx(functionExpression);
            setX(data.x.toString());
            setH(data.h.toString());
            setOrder(data.order.toString());
        })
        .catch((error) => {
            console.error("Error fetching example input:", error);
        });
  };

  const calculateForwardDividedDifference = () => {
    try {
      const expression = fx
        .replace(/e\^x/gi, 'exp(x)')
        .replace(/\(e\^x\)/gi, '(exp(x))')
        .replace(/e\^/gi, 'exp');
      
      if (order === 1) {
        // Simple forward difference for first order
        const fx_value = evaluate(expression, { x: parseFloat(x) });
        const fxh_value = evaluate(expression, { x: parseFloat(x) + parseFloat(h) });
        
        // Forward difference formula: [f(x + h) - f(x)] / h
        const approx = (fxh_value - fx_value) / parseFloat(h);
        
        const currentSteps = [
          {
            xValue: parseFloat(x),
            fxValue: fx_value,
            description: "f(x)"
          },
          {
            xValue: parseFloat(x) + parseFloat(h),
            fxValue: fxh_value,
            description: "f(x + h)"
          }
        ];

        setResult(approx);
        setSteps(currentSteps);
        setShowSteps(true);
      } else {
        // Higher order calculations
        let coefficients = [];
        for (let i = 0; i <= order; i++) {
          coefficients[i] = Math.pow(-1, order - i) * factorial(order) / 
            (factorial(i) * factorial(order - i));
        }

        let terms = [];
        let currentSteps = [];
        
        for (let i = 0; i <= order; i++) {
          const xValue = parseFloat(x) + i * parseFloat(h);
          const fxValue = evaluate(expression, { x: xValue });
          const coefficient = coefficients[i];
          const term = coefficient * fxValue / Math.pow(parseFloat(h), order);
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
        <h2 className="text-3xl mb-5">Forward Divided Difference</h2>
        
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

        <div className="flex justify-end">
          <button
            onClick={fetchExampleInput}
            className="my-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
            Get Example
          </button>
        </div>

        <button
          onClick={calculateForwardDividedDifference}
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
                    {order > 1 && <td className="border px-4 py-2">{step.coefficient.toFixed(6)}</td>}
                    {order > 1 && <td className="border px-4 py-2">{step.term.toFixed(6)}</td>}
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
