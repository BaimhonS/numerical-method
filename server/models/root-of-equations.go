package models

type (
	Graphical struct {
		ID       uint    `json:"id"`
		Equation string  `json:"equation"`
		Scan     float64 `json:"scan"`
	}

	Bisection struct {
		ID       uint    `json:"id"`
		Equation string  `json:"equation"`
		Xl       float64 `json:"xl"`
		Xr       float64 `json:"xr"`
		E        float64 `json:"e"`
	}

	FalsePosition struct {
		ID       uint    `json:"id"`
		Equation string  `json:"equation"`
		Xl       float64 `json:"xl"`
		Xr       float64 `json:"xr"`
		E        float64 `json:"e"`
	}

	OnePoint struct {
		ID       uint    `json:"id"`
		Equation string  `json:"equation"`
		E        float64 `json:"e"`
	}

	NewtonRaphson struct {
		ID       uint    `json:"id"`
		Equation string  `json:"equation"`
		X0       float64 `json:"x0"`
		E        float64 `json:"e"`
	}

	Secant struct {
		ID       uint    `json:"id"`
		Equation string  `json:""`
		X0       float64 `json:"X0"`
		X1       float64 `json:"X1"`
		E        float64 `json:"e"`
	}
)
