package models

type (
	Trapezoid struct {
		ID       uint    `json:"id" gorm:"primaryKey"`
		Function string  `json:"function"`
		Lower    float64 `json:"lower"`
		Upper    float64 `json:"upper"`
		Interval int     `json:"interval"`
	}
	Simpson struct {
		ID       uint    `json:"id" gorm:"primaryKey"`
		Function string  `json:"function"`
		Lower    float64 `json:"lower"`
		Upper    float64 `json:"upper"`
		Interval int     `json:"interval"`
	}
)
