package models

type (
	LinearNewton struct {
		ID     string      `json:"id"`
		Points [][]float64 `json:"points"`
		Point  []float64   `json:"point"`
		Xvalue float64     `json:"xvalue"`
	}
	QuadraticNewton struct {
		ID     string      `json:"id"`
		Points [][]float64 `json:"points"`
		Point  []float64   `json:"point"`
		Xvalue float64     `json:"xvalue"`
	}
	PolynomialNewton struct {
		ID     string      `json:"id"`
		Points [][]float64 `json:"points"`
		Point  []float64   `json:"point"`
		Xvalue float64     `json:"xvalue"`
	}

	QuadraticLagrange struct {
		ID     string      `json:"id"`
		Points [][]float64 `json:"points"`
		Point  []float64   `json:"point"`
		Xvalue []float64   `json:"xvalue"`
	}
)
