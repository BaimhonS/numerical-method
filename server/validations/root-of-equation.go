package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqGraphical struct {
		Equation string  `json:"equation"`
		Scan     float64 `json:"scan"`
	}

	ReqBisection struct {
		Equation string  `json:"equation"`
		Xl       float64 `json:"xl"`
		Xr       float64 `json:"xr"`
		E        float64 `json:"e"`
	}

	ReqFalsePosition struct {
		Equation string  `json:"equation"`
		Xl       float64 `json:"xl"`
		Xr       float64 `json:"xr"`
		E        float64 `json:"e"`
	}

	ReqOnePoint struct {
		Equation string  `json:"equation"`
		E        float64 `json:"e"`
	}

	ReqNewtonRaphson struct {
		Equation string  `json:"equation"`
		X        float64 `json:"x"`
	}

	ReqSecant struct {
		Equation string  `json:"equation"`
		X0       float64 `json:"X0"`
		X1       float64 `json:"X1"`
		E        float64 `json:"e"`
	}

	RootValidateImpl struct{}
)

type RootValidate interface {
	ValidateGraphical(c *fiber.Ctx) error
	ValidateBisection(c *fiber.Ctx) error
	ValidateFalsePosition(c *fiber.Ctx) error
	ValidateOnePoint(c *fiber.Ctx) error
	ValidateNewtonRaphson(c *fiber.Ctx) error
	ValidateSecant(c *fiber.Ctx) error
}

func NewRootValidate() RootValidate {
	return &RootValidateImpl{}
}

func (v *RootValidateImpl) ValidateGraphical(c *fiber.Ctx) error {
	var req ReqGraphical
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *RootValidateImpl) ValidateBisection(c *fiber.Ctx) error {
	var req ReqBisection
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *RootValidateImpl) ValidateFalsePosition(c *fiber.Ctx) error {
	var req ReqFalsePosition
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *RootValidateImpl) ValidateOnePoint(c *fiber.Ctx) error {
	var req ReqOnePoint
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *RootValidateImpl) ValidateNewtonRaphson(c *fiber.Ctx) error {
	var req ReqNewtonRaphson
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *RootValidateImpl) ValidateSecant(c *fiber.Ctx) error {
	var req ReqSecant
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
