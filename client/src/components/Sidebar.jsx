import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-fullscreen bg-gray-100 p-5 border-r border-gray-300">
      <h3 className="text-2xl font-semibold mb-5">Choose Method</h3>
      <ul>
        <li className="mb-2">
          <span className="font-medium">Root of Equations</span>
          <ul className="ml-6 mt-1">
            <li className="mb-1">
              <Link to="/graphical" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Graphical</Link>
            </li>
            <li className="mb-1">
              <Link to="/bisection" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Bisection</Link>
            </li>
            <li className="mb-1">
              <Link to="/false-position" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">False Position</Link>
            </li>
            <li className="mb-1">
              <Link to="/one-point" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">One Point</Link>
            </li>
            <li className="mb-1">
              <Link to="/newton" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Newton Raphson</Link>
            </li>
            <li className="mb-1">
              <Link to="/secant" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Secant</Link>
            </li>
          </ul>
        </li>
        <li className="mb-2">
          <span className="font-medium">Linear Algebra</span>
          <ul className="ml-6 mt-1">
            <li className="mb-1">
              <Link to="/cramer" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Cramer Rule</Link>
            </li>
            <li className="mb-1">
              <Link to="/gauss-eliminate" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Gauss Eliminate</Link>
            </li>
            <li className="mb-1">
              <Link to="/gauss-jordan" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Gauss Jordan</Link>
            </li>
            <li className="mb-1">
              <Link to="/lu-decomposition" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">LU Decomposition</Link>
            </li>
            <li className="mb-1">
              <Link to="/matrix-inverse" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Matrix Inverse</Link>
            </li>
            <li className="mb-1">
              <Link to="/cholesky-decomposition" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Cholesky Decomposition</Link>
            </li>
            <li className="mb-1">
              <Link to="/jacobi-iteration" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Jacobi Iteration</Link>
            </li>
            <li className="mb-1">
              <Link to="/gauss-seidel-iteration" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Gauss Seidel Iteration</Link>
            </li>
            <li className="mb-1">
              <Link to="/conjugate-gradient" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Conjugate Gradient</Link>
            </li>
          </ul>
        </li>
        <li className="mb-2">
          <span className="font-medium">Interpolation</span>
          <ul className="ml-6 mt-1">
            <li className="mb-1">
              <Link to="/linear-newton" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Linear Newton Divides-Difference</Link>
            </li>
            <li className="mb-1">
              <Link to="/quadratic-newton" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Quadratic Newton Divides-Difference</Link>
            </li>
            <li className="mb-1">
              <Link to="/polynomial-newton" className="block text-gray-600 hover:bg-gray-200 p-2 rounded">Polynomial Newton Divides-Difference</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
