package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqLinearRegression struct {
		Points string  `json:"points"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqPolynomialRegression struct {
		Points string  `json:"points"`
		Order  int     `json:"order"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqMultipleRegression struct {
		Points string `json:"points"`
		Xvalue string `json:"xvalue"`
	}

	LeastSquaresRegressionValidateImpl struct{}
)

type LeastSquaresRegressionValidate interface {
	ValidateLinearRegression(c *fiber.Ctx) error
	ValidatePolynomialRegression(c *fiber.Ctx) error
	ValidateMultipleRegression(c *fiber.Ctx) error
}

func NewLeastSquaresRegressionValidate() LeastSquaresRegressionValidate {
	return &LeastSquaresRegressionValidateImpl{}
}

func (v *LeastSquaresRegressionValidateImpl) ValidateLinearRegression(c *fiber.Ctx) error {
	var req ReqLinearRegression
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LeastSquaresRegressionValidateImpl) ValidatePolynomialRegression(c *fiber.Ctx) error {
	var req ReqPolynomialRegression
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LeastSquaresRegressionValidateImpl) ValidateMultipleRegression(c *fiber.Ctx) error {
	var req ReqMultipleRegression
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
