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
	GetMatrix(c *fiber.Ctx) error
	CreateMatrix(c *fiber.Ctx) error
	GetMatrixIteration(c *fiber.Ctx) error
	CreateMatrixIteration(c *fiber.Ctx) error
}

func NewLinearService(db *gorm.DB) LinearService {
	return &LinearServiceImpl{
		DB: db,
	}
}

// @Tags Matrix
// @Summary Get Matrix Result
// @Description Get the matrix result by ID
// @Accept json
// @Produce json
// @Param id path string true "Matrix ID"
// @Success 200 {object} models.Graphical
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/linear-algrebra/matrix/{id} [get]
func (l LinearServiceImpl) GetMatrix(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var matrix models.Matrix

	if err := l.DB.First(&matrix, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "matrix data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching matrix data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(matrix)
}

// @Tags Matrix
// @Summary Create Matrix Result
// @Description Create the matrix result
// @Accept json
// @Produce json
// @Success 201 {object} models.Matrix
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/linear-algrebra/matrix [post]
func (l *LinearServiceImpl) CreateMatrix(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqMatrix)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	matrix := models.Matrix{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		ConstantData: req.ConstantData,
	}

	if err := l.DB.Create(&matrix).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(matrix)
}

// @Tags Matrix Iteration
// @Summary Get Matrix Iteration Result
// @Description Get the matrix iteration result by ID
// @Accept json
// @Produce json
// @Param id path string true "Matrix Iteration ID"
// @Success 200 {object} models.Graphical
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/linear-algrebra/matrix-iteration/{id} [get]
func (l LinearServiceImpl) GetMatrixIteration(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var matrixIteration models.MatrixIteration

	if err := l.DB.First(&matrixIteration, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "matrix iteration data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching matrix iteration data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(matrixIteration)
}

// @Tags Matrix Iteration
// @Summary Create Matrix Iteration Result
// @Description Create the matrix iteration result
// @Accept json
// @Produce json
// @Success 201 {object} models.MatrixIteration
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/linear-algrebra/matrix-iteration [post]
func (l *LinearServiceImpl) CreateMatrixIteration(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqMatrixIteration)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	matrixIteration := models.MatrixIteration{
		MatrixSize:   req.MatrixSize,
		MatrixData:   req.MatrixData,
		Error:        req.Error,
		ConstantData: req.ConstantData,
	}

	if err := l.DB.Create(&matrixIteration).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(matrixIteration)
}
