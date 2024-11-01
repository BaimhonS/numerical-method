package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqNumericalDiff struct {
		Function string  `json:"function"`
		X        int     `json:"x"`
		H        float32 `json:"h"`
		Order    int     `json:"order"`
	}

	NumericalDiffValidateImpl struct{}
)

type NumericalDiffValidate interface {
	ValidateNumericalDiff(c *fiber.Ctx) error
}

func NewNumericalDiffValidate() NumericalDiffValidate {
	return &NumericalDiffValidateImpl{}
}

func (v *NumericalDiffValidateImpl) ValidateNumericalDiff(c *fiber.Ctx) error {
	var req ReqNumericalDiff
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
