package models

type (
	NumericalDiff struct {
		ID       uint    `json:"id" gorm:"autoIncrement"`
		Function string  `json:"function"`
		X        int     `json:"x"`
		H        float32 `json:"h"`
		Order    int     `json:"order"`
	}
)
