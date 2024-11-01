package models

type (
	LinearNewton struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	QuadraticNewton struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	PolynomialNewton struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}

	QuadraticLagrange struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	QuadraticSpline struct {
		ID     uint   `json:"id" gorm:"autoIncrement"`
		Points string `json:"points"`
		Point  string `json:"point"`
		Xvalue string `json:"xvalue"`
	}
)
