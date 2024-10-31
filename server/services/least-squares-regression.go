package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type LeastSquaresRegressionServiceImpl struct {
	DB *gorm.DB
}

type LeastSquaresRegressionService interface {
	GetLinearRegression(c *fiber.Ctx) error
	CreateLinearRegression(c *fiber.Ctx) error
	GetPolynomialRegression(c *fiber.Ctx) error
	CreatePolynomialRegression(c *fiber.Ctx) error
	GetMultipleRegression(c *fiber.Ctx) error
	CreateMultipleRegression(c *fiber.Ctx) error
}

func NewLeastSquaresRegressionService(db *gorm.DB) LeastSquaresRegressionService {
	return &LeastSquaresRegressionServiceImpl{
		DB: db,
	}
}

// @Tags Linear Regression
// @Summary Get Linear Regression Result
// @Description Get the linear regression result by ID
// @Accept json
// @Produce json
// @Param id path string true "Linear Regression ID"
// @Success 200 {object} models.LinearRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/least-squares-regression/linear-regression/{id} [get]
func (l LeastSquaresRegressionServiceImpl) GetLinearRegression(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var linearRegression models.LinearRegression

	if err := l.DB.First(&linearRegression, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Linear regression data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(linearRegression)
}

// @Tags Linear Regression
// @Summary Create Linear Regression Result
// @Description Create the linear regression result
// @Accept json
// @Produce json
// @Success 201 {object} models.LinearRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/least-squares-regression/linear-regression [post]
func (l LeastSquaresRegressionServiceImpl) CreateLinearRegression(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqLinearRegression)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	linearRegression := models.LinearRegression{
		Points: req.Points,
		Xvalue: req.Xvalue,
	}

	if err := l.DB.Create(&linearRegression).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(linearRegression)
}

// @Tags Polynomial Regression
// @Summary Get Polynomial Regression Result
// @Description Get the polynomial regression result by ID
// @Accept json
// @Produce json
// @Param id path string true "Polynomial Regression ID"
// @Success 200 {object} models.PolynomialRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/least-squares-regression/polynomial-regression/{id} [get]
func (l LeastSquaresRegressionServiceImpl) GetPolynomialRegression(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var polynomialRegression models.PolynomialRegression

	if err := l.DB.First(&polynomialRegression, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Polynomial regression data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(polynomialRegression)
}

// @Tags Polynomial Regression
// @Summary Create Polynomial Regression Result
// @Description Create the polynomial regression result
// @Accept json
// @Produce json
// @Success 201 {object} models.PolynomialRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/least-squares-regression/polynomial-regression [post]
func (l LeastSquaresRegressionServiceImpl) CreatePolynomialRegression(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqPolynomialRegression)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	polynomialRegression := models.PolynomialRegression{
		Points: req.Points,
		Order:  req.Order,
		Xvalue: req.Xvalue,
	}

	if err := l.DB.Create(&polynomialRegression).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(polynomialRegression)
}

// @Tags Multiple Regression
// @Summary Get Multiple Regression Result
// @Description Get the multiple regression result by ID
// @Accept json
// @Produce json
// @Param id path string true "Multiple Regression ID"
// @Success 200 {object} models.MultipleRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/least-squares-regression/multiple-regression/{id} [get]
func (l LeastSquaresRegressionServiceImpl) GetMultipleRegression(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var multipleRegression models.MultipleRegression

	if err := l.DB.First(&multipleRegression, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
			Message: "Multiple regression data not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(multipleRegression)
}

// @Tags Multiple Regression
// @Summary Create Multiple Regression Result
// @Description Create the multiple regression result
// @Accept json
// @Produce json
// @Success 201 {object} models.MultipleRegression
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Router /numerical-method/least-squares-regression/multiple-regression [post]
func (l LeastSquaresRegressionServiceImpl) CreateMultipleRegression(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqMultipleRegression)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	multipleRegression := models.MultipleRegression{
		Points: req.Points,
		Xvalue: req.Xvalue,
	}

	if err := l.DB.Create(&multipleRegression).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(multipleRegression)
}
