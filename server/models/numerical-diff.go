package models

type (
	NumericalDiff struct {
		ID       uint   `json:"id"`
		Function string `json:"function"`
		X        string `json:"x"`
		Size     int    `json:"size"`
		Order    int    `json:"order"`
	}
)
