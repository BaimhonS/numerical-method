package services

import "gorm.io/gorm"

type LinearServiceImpl struct {
	DB *gorm.DB
}

type LinearService interface {
}

func NewLinearService() LinearService {
	return &LinearServiceImpl{}
}
