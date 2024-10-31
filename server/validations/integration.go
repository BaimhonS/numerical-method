package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqTrapezoid struct {
		Function string  `json:"function"`
		Lower    float64 `json:"lower"`
		Upper    float64 `json:"upper"`
		Interval int     `json:"interval"`
	}
	ReqSimpson struct {
		Function string  `json:"function"`
		Lower    float64 `json:"lower"`
		Upper    float64 `json:"upper"`
		Interval int     `json:"interval"`
	}

	IntegrationValidateImpl struct{}
)

type IntegrationValidate interface {
	ValidateTrapezoid(c *fiber.Ctx) error
	ValidateSimpson(c *fiber.Ctx) error
}

func NewIntegrationValidate() IntegrationValidate {
	return &IntegrationValidateImpl{}
}

func (v *IntegrationValidateImpl) ValidateTrapezoid(c *fiber.Ctx) error {
	var req ReqTrapezoid
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}

	c.Locals("req", req)
	return c.Next()
}

func (v *IntegrationValidateImpl) ValidateSimpson(c *fiber.Ctx) error {
	var req ReqSimpson
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
