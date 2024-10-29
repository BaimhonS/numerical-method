package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqMatrix struct {
		MatrixSize   int    `json:"matrix_size"`
		MatrixData   string `json:"matrix_data"`
		ConstantData string `json:"constant_data"`
	}

	ReqMatrixIteration struct {
		MatrixSize   int     `json:"matrix_size"`
		MatrixData   string  `json:"matrix_data"`
		Error        float64 `json:"error"`
		ConstantData string  `json:"constant_data"`
	}
	LinearValidateImpl struct{}
)

type LinearValidate interface {
	ValidateMatrix(c *fiber.Ctx) error
	ValidateMatrixIteration(c *fiber.Ctx) error
}

func NewLinearValidate() LinearValidate {
	return &LinearValidateImpl{}
}
func (v *LinearValidateImpl) ValidateMatrix(c *fiber.Ctx) error {
	var req ReqMatrix
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateMatrixIteration(c *fiber.Ctx) error {
	var req ReqMatrixIteration
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}
