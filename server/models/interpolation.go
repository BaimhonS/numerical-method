package models

type (
	LinearNewton struct {
		ID     string  `json:"id"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	QuadraticNewton struct {
		ID     string  `json:"id"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	PolynomialNewton struct {
		ID     string  `json:"id"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}

	QuadraticLagrange struct {
		ID     string `json:"id"`
		Points string `json:"points"`
		Point  string `json:"point"`
		Xvalue string `json:"xvalue"`
	}
)
