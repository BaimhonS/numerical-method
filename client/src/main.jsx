import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Bisection from './pages/rootOfEquations/Bisection.jsx'
import Graphical from './pages/rootOfEquations/Graphical.jsx'
import OnePoint from './pages/rootOfEquations/OnePoint.jsx'
import FalsePosition from './pages/rootOfEquations/FalsePosition.jsx'
import NewtonRaphson from './pages/rootOfEquations/NewtonRaphson.jsx'
import Secant from './pages/rootOfEquations/Secant.jsx'
import CramerRule from './pages/linearAlgebras/CramerRule.jsx'
import GaussEliminate from './pages/linearAlgebras/GaussEliminate.jsx'
import GaussJordan from './pages/linearAlgebras/GaussJordan.jsx'
import LUDecomposition from './pages/linearAlgebras/LUDecomposition.jsx'
import MatrixInverse from './pages/linearAlgebras/MatrixInverse.jsx'
import CholeskyDecomposition from './pages/linearAlgebras/CholeskyDecomposition.jsx'
import JacobiIteration from './pages/linearAlgebras/JacobiIteration.jsx'
import GaussSeidelIteration from './pages/linearAlgebras/GaussSeidelIteration.jsx'
import ConjugateGradient from './pages/linearAlgebras/ConjugateGradient.jsx'
import LinearNewton from './pages/Interpolation/LinearNewton.jsx'
import QuadraticNewton from './pages/Interpolation/QuadraticNewton.jsx'
import PolynomialNewton from './pages/Interpolation/PolynomialNewton.jsx'
import LinearLagrange from './pages/Interpolation/LinearLagrange.jsx'
import QuadraticLagrange from './pages/Interpolation/QuadraticLargange.jsx'
import PolynomialLagrange from './pages/Interpolation/PolynomialLagange.jsx'
import LinearSpline from './pages/Interpolation/LinearSpline.jsx'
import QuadraticSpline from './pages/Interpolation/QuadraticSpline.jsx'
import CubicSpline from './pages/Interpolation/CubicSpline.jsx'
import LinearRegression from './pages/least-squares-regression/LinearRegression.jsx'
import PolynomialRegression from './pages/least-squares-regression/PolynomialRegression.jsx'
import MultipleLinearRegression from './pages/least-squares-regression/MultipleLinearRegression.jsx'
import TrapezoidalRule from './pages/Integrate/TrapezoidalResult.jsx'
import SimpsonRule from './pages/Integrate/SimpsonRule.jsx'
import ForwardDividedDifference from './pages/NumericalDifferentiation/Forward.jsx'
import BackwardDividedDifference from './pages/NumericalDifferentiation/Backward.jsx'
import CentralDividedDifference from './pages/NumericalDifferentiation/Central.jsx'

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/bisection",
    element: <Bisection />
  },
  {
    path: "/graphical",
    element: <Graphical />
  },
  {
    path: "/one-point",
    element: <OnePoint />
  },
  {
    path: "/false-position",
    element: <FalsePosition />
  },
  {
    path: "/newton",
    element: <NewtonRaphson />
  },
  {
    path: "/secant",
    element: <Secant />
  },
  {
    path: "/cramer",
    element: <CramerRule />
  },
  {
    path: "/gauss-eliminate",
    element: <GaussEliminate />
  },
  {
    path: "/gauss-jordan",
    element: <GaussJordan />
  },
  {
    path: "/lu-decomposition",
    element: <LUDecomposition />
  },
  {
    path: "/matrix-inverse",
    element: <MatrixInverse />
  },
  {
    path: "/cholesky-decomposition",
    element: <CholeskyDecomposition />
  },
  {
    path: "/jacobi-iteration",
    element: <JacobiIteration />
  },
  {
    path: "/gauss-seidel-iteration",
    element: <GaussSeidelIteration />
  },
  {
    path: "/conjugate-gradient",
    element: <ConjugateGradient />
  },
  {
    path: "/linear-newton",
    element: <LinearNewton />
  },
  {
    path: "/quadratic-newton",
    element: <QuadraticNewton />
  },
  {
    path: "/polynomial-newton",
    element: <PolynomialNewton />
  },
  {
    path: "/linear-largrage",
    element: <LinearLagrange />
  },
  {
    path: "/quagratic-largrage",
    element: <QuadraticLagrange />
  },
  {
    path: "/polynomial-largrage",
    element: <PolynomialLagrange />
  },
  {
    path: "/linear-spline",
    element: <LinearSpline />
  },
  {
    path: "/quadratic-spline",
    element: <QuadraticSpline />
  },
  {
    path: "/cubic-spline",
    element: <CubicSpline />
  },
  {
    path: "/linear-regression",
    element: <LinearRegression />
  },
  {
    path: "/polynomial-regression",
    element: <PolynomialRegression />
  },
  {
    path: "/multiply-linear-regression",
    element: <MultipleLinearRegression />
  },
  {
    path: "/trapezoidal-rule",
    element: <TrapezoidalRule />
  },
  {
    path: "/simpson-rule",
    element: <SimpsonRule />
  },
  {
    path: "/forward-divided-diff",
    element: <ForwardDividedDifference />
  },
  {
    path: "/backward-divided-diff",
    element: <BackwardDividedDifference />
  },
  {
    path: "/central-divided-diff",
    element: <CentralDividedDifference />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
