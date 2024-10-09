package models

type (
	CramerRule struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	GaussEliminate struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	GaussJordan struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	MatrixInverse struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	LUDecomposition struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	CholeskyDecomposition struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	JacobiIteration struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		Error        float64     `json:"e"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	GaussSaidelIteration struct {
		ID           uint        `gorm:"primaryKey"`
		MatrixSize   int         `json:"matrix_size"`
		Error        float64     `json:"e"`
		MatrixData   [][]float64 `gorm:"type:json" json:"matrix_data"`
		ConstantData []float64   `gorm:"type:json" json:"constant_data"`
	}

	/// struct {}
)
