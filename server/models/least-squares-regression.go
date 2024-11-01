package models

type (
	LinearRegression struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Xvalue float64 `json:"xvalue"`
	}
	PolynomialRegression struct {
		ID     uint    `json:"id" gorm:"autoIncrement"`
		Points string  `json:"points"`
		Order  int     `json:"order"`
		Xvalue float64 `json:"xvalue"`
	}
	MultipleRegression struct {
		ID     uint   `json:"id" gorm:"autoIncrement"`
		Points string `json:"points"`
		Xvalue string `json:"xvalue"`
	}
)
