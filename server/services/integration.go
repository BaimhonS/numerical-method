package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type IntegrationServiceImpl struct {
	db *gorm.DB
}

type IntegrationService interface {
	GetTrapezoid(c *fiber.Ctx) error
	CreateTrapezoid(c *fiber.Ctx) error
	GetSimpson(c *fiber.Ctx) error
	CreateSimpson(c *fiber.Ctx) error
}

func NewIntegrationService(db *gorm.DB) IntegrationService {
	return &IntegrationServiceImpl{db}
}

// @Tags Trapezoid
// @Summary Get Trapezoid
// @Description Get the trapezoid data
// @Accept json
// @Produce json
// @Success 200 {object} models.Trapezoid
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/integration/trapezoid/{id} [get]
func (s *IntegrationServiceImpl) GetTrapezoid(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var trapezoid models.Trapezoid

	if err := s.db.First(&trapezoid, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "trapezoid data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(trapezoid)
}

// @Tags Trapezoid
// @Summary Create Trapezoid
// @Description Create the trapezoid data
// @Accept json
// @Produce json
// @Success 200 {object} models.Trapezoid
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/integration/trapezoid [post]
func (s *IntegrationServiceImpl) CreateTrapezoid(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqTrapezoid)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "invalid request",
		})
	}

	trapezoid := models.Trapezoid{
		Function: req.Function,
		Lower:    req.Lower,
		Upper:    req.Upper,
		Interval: req.Interval,
	}

	if err := s.db.Create(&trapezoid).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "failed to create trapezoid",
			Error:   err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(trapezoid)
}

// @Tags Simpson
// @Summary Get Simpson
// @Description Get the simpson data
// @Accept json
// @Produce json
// @Success 200 {object} models.Simpson
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/integration/simpson/{id} [get]
func (s *IntegrationServiceImpl) GetSimpson(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var simpson models.Simpson

	if err := s.db.First(&simpson, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "simpson data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(simpson)
}

// @Tags Simpson
// @Summary Create Simpson
// @Description Create the simpson data
// @Accept json
// @Produce json
// @Success 200 {object} models.Simpson
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/integration/simpson [post]
func (s *IntegrationServiceImpl) CreateSimpson(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqSimpson)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "invalid request",
		})
	}

	simpson := models.Simpson{
		Function: req.Function,
		Lower:    req.Lower,
		Upper:    req.Upper,
		Interval: req.Interval,
	}

	if err := s.db.Create(&simpson).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "failed to create simpson",
			Error:   err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(simpson)
}
