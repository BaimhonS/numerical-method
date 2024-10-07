package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type RootServiceImpl struct {
	DB *gorm.DB
}

type RootService interface {
	GetGraphical(c *fiber.Ctx) error
	CreateGraphical(c *fiber.Ctx) error
	GetBisection(c *fiber.Ctx) error
	CreateBisection(c *fiber.Ctx) error
}

func NewRootService(db *gorm.DB) RootService {
	return &RootServiceImpl{
		DB: db,
	}
}

func (s *RootServiceImpl) GetGraphical(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var graphical models.Graphical

	if err := s.DB.First(&graphical, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Graphical data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching graphical data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(graphical)
}

func (s *RootServiceImpl) CreateGraphical(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqGraphical)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	graphical := models.Graphical{
		Equation: req.Equation,
		Scan:     req.Scan,
	}

	if err := s.DB.Create(&graphical).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(graphical)
}

func (s *RootServiceImpl) GetBisection(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var bisection models.Bisection

	if err := s.DB.First(&bisection, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Bisection data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching graphical data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(bisection)
}

func (s *RootServiceImpl) CreateBisection(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqBisection)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	bisection := models.Bisection{
		Equation: req.Equation,
		Xl:       req.Xl,
		Xr:       req.Xr,
		E:        req.E,
	}

	if err := s.DB.Create(&bisection).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(bisection)
}
