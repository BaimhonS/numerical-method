package services

import (
	"log"

	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type NumericalDiffServiceImpl struct {
	DB *gorm.DB
}

type NumericalDiffService interface {
	GetNumericalDiff(c *fiber.Ctx) error
	CreateNumericalDiff(c *fiber.Ctx) error
}

func NewNumericalDiffService(db *gorm.DB) NumericalDiffService {
	return &NumericalDiffServiceImpl{DB: db}
}

// @Tags numerical-diff
// @Summary Get numerical diff
// @Description Get numerical diff by id
// @Accept json
// @Produce json
// @Param id path string true "Numerical diff id"
// @Success 200 {object} models.NumericalDiff
// @Failure 400 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /numerical-method/numerical-diff/{id} [get]
func (s *NumericalDiffServiceImpl) GetNumericalDiff(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "id is required",
		})
	}

	var numericalDiff models.NumericalDiff
	if err := s.DB.Where("id = ?", id).First(&numericalDiff).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "numerical diff not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(numericalDiff)
}

// @Tags numerical-diff
// @Summary Create numerical diff
// @Description Create numerical diff
// @Accept json
// @Produce json
// @Param req body validations.ReqNumericalDiff true "Request Body"
// @Success 201 {object} models.NumericalDiff
// @Failure 400 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /numerical-method/numerical-diff [post]
func (s *NumericalDiffServiceImpl) CreateNumericalDiff(c *fiber.Ctx) error {
	log.Println("CreateNumericalDiff")
	req, ok := c.Locals("req").(validations.ReqNumericalDiff)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "invalid request",
		})
	}

	numericalDiff := models.NumericalDiff{
		Function: req.Function,
		X:        req.X,
		H:        req.H,
		Order:    req.Order,
	}

	if err := s.DB.Create(&numericalDiff).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "failed to create numerical diff",
		})
	}

	return c.Status(fiber.StatusOK).JSON(numericalDiff)
}
