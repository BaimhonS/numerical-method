package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type InterpolationServiceImpl struct {
	DB *gorm.DB
}

type InterpolationService interface {
	GetLinearNewton(c *fiber.Ctx) error
	CreateLinearNewton(c *fiber.Ctx) error
	GetQuadraticNewton(c *fiber.Ctx) error
	CreateQuadraticNewton(c *fiber.Ctx) error
	GetPolynomialNewton(c *fiber.Ctx) error
	CreatePolynomialNewton(c *fiber.Ctx) error
	GetQuadraticLagrange(c *fiber.Ctx) error
	CreateQuadraticLagrange(c *fiber.Ctx) error
	GetQuadraticSpline(c *fiber.Ctx) error
	CreateQuadraticSpline(c *fiber.Ctx) error
}

func NewInterpolationService(db *gorm.DB) InterpolationService {
	return &InterpolationServiceImpl{
		DB: db,
	}
}

// @Tags Linear Newton
// @Summary Get Linear Newton
// @Description Get the linear newton data
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {object} models.LinearNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/linear-newton/{id} [get]
func (s *InterpolationServiceImpl) GetLinearNewton(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var linearNewton models.LinearNewton

	if err := s.DB.First(&linearNewton, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Linear Newton data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(linearNewton)
}

// @Tags Linear Newton
// @Summary Create Linear Newton
// @Description Create the linear newton data
// @Accept json
// @Produce json
// @Param req body validations.ReqLinearNewton true "Request Body"
// @Success 201 {object} models.LinearNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/linear-newton [post]
func (s *InterpolationServiceImpl) CreateLinearNewton(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqLinearNewton)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	linearNewton := models.LinearNewton{
		Points: req.Points,
		Point:  req.Point,
		Xvalue: req.Xvalue,
	}
	if err := s.DB.Create(&linearNewton).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(linearNewton)
}

// @Tags Quadratic Newton
// @Summary Get Quadratic Newton
// @Description Get the quadratic newton data
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {object} models.QuadraticNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-newton/{id} [get]
func (s *InterpolationServiceImpl) GetQuadraticNewton(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var quadraticNewton models.QuadraticNewton

	if err := s.DB.First(&quadraticNewton, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Quadratic Newton data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticNewton)
}

// @Tags Quadratic Newton
// @Summary Create Quadratic Newton
// @Description Create the quadratic newton data
// @Accept json
// @Produce json
// @Param req body validations.ReqQuadraticNewton true "Request Body"
// @Success 201 {object} models.QuadraticNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-newton [post]
func (s *InterpolationServiceImpl) CreateQuadraticNewton(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqQuadraticNewton)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	quadraticNewton := models.QuadraticNewton{
		Points: req.Points,
		Point:  req.Point,
		Xvalue: req.Xvalue,
	}
	if err := s.DB.Create(&quadraticNewton).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticNewton)
}

// @Tags Polynomial Newton
// @Summary Get Polynomial Newton
// @Description Get the polynomial newton data
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {object} models.PolynomialNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/polynomial-newton/{id} [get]
func (s *InterpolationServiceImpl) GetPolynomialNewton(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var polynomialNewton models.PolynomialNewton

	if err := s.DB.First(&polynomialNewton, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Polynomial Newton data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(polynomialNewton)
}

// @Tags Polynomial Newton
// @Summary Create Polynomial Newton
// @Description Create the polynomial newton data
// @Accept json
// @Produce json
// @Param req body validations.ReqPolynomialNewton true "Request Body"
// @Success 201 {object} models.PolynomialNewton
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/polynomial-newton [post]
func (s *InterpolationServiceImpl) CreatePolynomialNewton(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqPolynomialNewton)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	polynomialNewton := models.PolynomialNewton{
		Points: req.Points,
		Point:  req.Point,
		Xvalue: req.Xvalue,
	}
	if err := s.DB.Create(&polynomialNewton).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(polynomialNewton)
}

// @Tags Quadratic Lagrange
// @Summary Get Quadratic Lagrange
// @Description Get the quadratic lagrange data
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {object} models.QuadraticLagrange
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-lagrange/{id} [get]
func (s *InterpolationServiceImpl) GetQuadraticLagrange(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var quadraticLagrange models.QuadraticLagrange

	if err := s.DB.First(&quadraticLagrange, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Quadratic Lagrange data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticLagrange)
}

// @Tags Quadratic Lagrange
// @Summary Create Quadratic Lagrange
// @Description Create the quadratic lagrange data
// @Accept json
// @Produce json
// @Param req body validations.ReqQuadraticLagrange true "Request Body"
// @Success 201 {object} models.QuadraticLagrange
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-lagrange [post]
func (s *InterpolationServiceImpl) CreateQuadraticLagrange(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqQuadraticLagrange)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	quadraticLagrange := models.QuadraticLagrange{
		Points: req.Points,
		Point:  req.Point,
		Xvalue: req.Xvalue,
	}
	if err := s.DB.Create(&quadraticLagrange).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticLagrange)
}

// @Tags Quadratic Spline
// @Summary Get Quadratic Spline
// @Description Get the quadratic spline data
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {object} models.QuadraticSpline
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-spline/{id} [get]
func (s *InterpolationServiceImpl) GetQuadraticSpline(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var quadraticSpline models.QuadraticSpline

	if err := s.DB.First(&quadraticSpline, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Quadratic Spline data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticSpline)
}

// @Tags Quadratic Spline
// @Summary Create Quadratic Spline
// @Description Create the quadratic spline data
// @Accept json
// @Produce json
// @Param req body validations.ReqQuadraticSpline true "Request Body"
// @Success 201 {object} models.QuadraticSpline
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/interpolation/quadratic-spline [post]
func (s *InterpolationServiceImpl) CreateQuadraticSpline(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqQuadraticSpline)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	quadraticSpline := models.QuadraticSpline{
		Points: req.Points,
		Point:  req.Point,
		Xvalue: req.Xvalue,
	}
	if err := s.DB.Create(&quadraticSpline).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(quadraticSpline)
}
