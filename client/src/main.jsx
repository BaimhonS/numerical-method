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
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
