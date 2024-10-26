package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type LinearServiceImpl struct {
	DB *gorm.DB
}

type LinearService interface {
	GetCramerRule(c *fiber.Ctx) error
	CreateCramerRule(c *fiber.Ctx) error
	GetGaussEliminate(c *fiber.Ctx) error
	CreateGaussEliminate(c *fiber.Ctx) error
	GetGaussJordan(c *fiber.Ctx) error
	CreateGaussJordan(c *fiber.Ctx) error
	GetLUDecomposition(c *fiber.Ctx) error
	CreateLUDecomposition(c *fiber.Ctx) error
	GetMatrixInverse(c *fiber.Ctx) error
	CreateMatrixInverse(c *fiber.Ctx) error
	GetCholeskyDecomposition(c *fiber.Ctx) error
	CreateCholeskyDecomposition(c *fiber.Ctx) error
	GetJacobiIteration(c *fiber.Ctx) error
	CreateJacobiIteration(c *fiber.Ctx) error
	GetGaussSeidelIteration(c *fiber.Ctx) error
	CreateGaussSaidelIteration(c *fiber.Ctx) error
	GetConjugateGradient(c *fiber.Ctx) error
	CreateConjugateGradient(c *fiber.Ctx) error
}

func NewLinearService(db *gorm.DB) LinearService {
	return &LinearServiceImpl{
		DB: db,
	}
}

func (l LinearServiceImpl) GetCramerRule(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var cramerRule models.CramerRule

	if err := l.DB.First(&cramerRule, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "CramerRule data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching cramer rule data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(cramerRule)
}
func (s *LinearServiceImpl) CreateCramerRule(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqCramerRule)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	cramerRule := models.CramerRule{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&cramerRule).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(cramerRule)
}
func (l LinearServiceImpl) GetGaussEliminate(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var gaussEliminate models.GaussEliminate

	if err := l.DB.First(&gaussEliminate, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Gauss Eliminate data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching eliminate data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(gaussEliminate)
}
func (s *LinearServiceImpl) CreateGaussEliminate(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqGaussEliminate)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	gaussEliminate := models.GaussEliminate{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&gaussEliminate).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(gaussEliminate)
}
func (l LinearServiceImpl) GetGaussJordan(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var gaussJordan models.GaussJordan

	if err := l.DB.First(&gaussJordan, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Gauss Jordan data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching jordan data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(gaussJordan)
}
func (s *LinearServiceImpl) CreateGaussJordan(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqGaussJordan)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	gaussJordan := models.GaussJordan{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&gaussJordan).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(gaussJordan)
}
func (l LinearServiceImpl) GetLUDecomposition(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var luDecomposition models.LUDecomposition

	if err := l.DB.First(&luDecomposition, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "LUDemposition data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching lu decomposition data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(luDecomposition)
}
func (s *LinearServiceImpl) CreateLUDecomposition(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqLUDecomposition)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	luDecomposition := models.LUDecomposition{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&luDecomposition).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(luDecomposition)
}
func (l LinearServiceImpl) GetMatrixInverse(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var matrixInverse models.MatrixInverse

	if err := l.DB.First(&matrixInverse, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Matrix inverse data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching Matrix inverse data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(matrixInverse)
}
func (s *LinearServiceImpl) CreateMatrixInverse(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqMatrixInverse)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	matrixInverse := models.MatrixInverse{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&matrixInverse).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(matrixInverse)
}
func (l LinearServiceImpl) GetCholeskyDecomposition(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var choleskyDecomposition models.CholeskyDecomposition

	if err := l.DB.First(&choleskyDecomposition, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Cholesky Decomposition data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching Cholesky Decomposition data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(choleskyDecomposition)
}
func (s *LinearServiceImpl) CreateCholeskyDecomposition(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqCholeskyDecomposition)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	choleskyDecomposition := models.CholeskyDecomposition{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&choleskyDecomposition).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(choleskyDecomposition)
}
func (l LinearServiceImpl) GetJacobiIteration(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var jacobiIteration models.JacobiIteration

	if err := l.DB.First(&jacobiIteration, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "jacobi Iteration not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching jacobi Iteration data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(jacobiIteration)
}
func (s *LinearServiceImpl) CreateJacobiIteration(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqJacobiIteration)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	jacobiIteration := models.JacobiIteration{
		MatrixSize:   req.MatrixSize,
		Error:        req.Error,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&jacobiIteration).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(jacobiIteration)
}
func (l LinearServiceImpl) GetGaussSeidelIteration(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var gaussSaidelIteration models.GaussSaidelIteration

	if err := l.DB.First(&gaussSaidelIteration, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "gauss saidel iteration data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching gauss saidel iteration data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(gaussSaidelIteration)
}
func (s *LinearServiceImpl) CreateGaussSaidelIteration(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqGaussSaidelIteration)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	gaussSaidelIteration := models.GaussSaidelIteration{
		MatrixSize:   req.MatrixSize,
		Error:        req.Error,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&gaussSaidelIteration).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(gaussSaidelIteration)
}
func (l LinearServiceImpl) GetConjugateGradient(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var conjugateGradient models.ConjugateGradient

	if err := l.DB.First(&conjugateGradient, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "conjugate Gradient data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching conjugate Gradient data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(conjugateGradient)
}
func (s *LinearServiceImpl) CreateConjugateGradient(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqConjugate)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	conjugateGradient := models.ConjugateGradient{
		MatrixSize:   req.MatrixSize,
		Error:        req.Error,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := s.DB.Create(&conjugateGradient).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(conjugateGradient)
}
