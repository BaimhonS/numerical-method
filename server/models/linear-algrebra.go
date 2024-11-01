package models

type (
	Matrix struct {
		ID           uint   `json:"id" gorm:"autoIncrement"`
		MatrixSize   int    `json:"matrix_size"`
		MatrixData   string `json:"matrix_data"`
		ConstantData string `json:"constant_data"`
	}

	MatrixIteration struct {
		ID           uint    `json:"id" gorm:"autoIncrement"`
		MatrixSize   int     `json:"matrix_size"`
		Error        float64 `json:"e"`
		MatrixData   string  `json:"matrix_data"`
		ConstantData string  `json:"constant_data"`
	}
)
