package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqLinearNewton struct {
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqQuadraticNewton struct {
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqPolynomialNewton struct {
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqQuadraticLagrange struct {
		Points string  `json:"points"`
		Point  string  `json:"point"`
		Xvalue float64 `json:"xvalue"`
	}
	ReqQuadraticSpline struct {
		Points string `json:"points"`
		Point  string `json:"point"`
		Xvalue string `json:"xvalue"`
	}

	InterpolationValidateImpl struct{}
)

type InterpolationValidate interface {
	ValidateLinearNewton(c *fiber.Ctx) error
	ValidateQuadraticNewton(c *fiber.Ctx) error
	ValidatePolynomialNewton(c *fiber.Ctx) error
	ValidateQuadraticLagrange(c *fiber.Ctx) error
	ValidateQuadraticSpline(c *fiber.Ctx) error
}

func NewInterpolationValidate() InterpolationValidate {
	return &InterpolationValidateImpl{}
}

func (v *InterpolationValidateImpl) ValidateLinearNewton(c *fiber.Ctx) error {
	var req ReqLinearNewton
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *InterpolationValidateImpl) ValidateQuadraticNewton(c *fiber.Ctx) error {
	var req ReqQuadraticNewton
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *InterpolationValidateImpl) ValidatePolynomialNewton(c *fiber.Ctx) error {
	var req ReqPolynomialNewton
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *InterpolationValidateImpl) ValidateQuadraticLagrange(c *fiber.Ctx) error {
	var req ReqQuadraticLagrange
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *InterpolationValidateImpl) ValidateQuadraticSpline(c *fiber.Ctx) error {
	var req ReqQuadraticSpline
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
