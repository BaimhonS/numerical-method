package validations

import (
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/gofiber/fiber/v2"
)

type (
	ReqCramerRule struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqGaussEliminate struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqGaussJordan struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqMatrixInverse struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqLUDecomposition struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqCholeskyDecomposition struct {
		MatrixSize   int         `json:"matrix_size"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqJacobiIteration struct {
		MatrixSize   int         `json:"matrix_size"`
		Error        float64     `json:"e"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	ReqGaussSaidelIteration struct {
		MatrixSize   int         `json:"matrix_size"`
		Error        float64     `json:"e"`
		MatrixData   [][]float64 `json:"matrix_data"`
		ConstantData []float64   `json:"constant_data"`
	}

	// ReqConjugate struct {
	// }
	LinearValidateImpl struct{}
)

type LinearValidate interface {
	ValidateCramerRul(c *fiber.Ctx) error
	ValidateGaussEliminate(c *fiber.Ctx) error
	ValidateGaussJordan(c *fiber.Ctx) error
	ValidateLUDecomposition(c *fiber.Ctx) error
	ValidateCholeskyDecomposition(c *fiber.Ctx) error
	ValidateJacobiIteration(c *fiber.Ctx) error
	ValidateGaussSaidelIteration(c *fiber.Ctx) error
}

func NewLinearValidate() LinearValidate {
	return &LinearValidateImpl{}
}
func (v *LinearValidateImpl) ValidateCramerRul(c *fiber.Ctx) error {
	var req ReqCramerRule
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateGaussEliminate(c *fiber.Ctx) error {
	var req ReqGaussEliminate
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateGaussJordan(c *fiber.Ctx) error {
	var req ReqGaussJordan
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateLUDecomposition(c *fiber.Ctx) error {
	var req ReqLUDecomposition
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateCholeskyDecomposition(c *fiber.Ctx) error {
	var req ReqCholeskyDecomposition
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateJacobiIteration(c *fiber.Ctx) error {
	var req ReqJacobiIteration
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

func (v *LinearValidateImpl) ValidateGaussSaidelIteration(c *fiber.Ctx) error {
	var req ReqGaussSaidelIteration
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "body parser error",
			Error:   err,
		})
	}
	c.Locals("req", req)
	return c.Next()
}

// func (v *LinearValidateImpl) ValidateConjugate(c *fiber.Ctx) error {
// 	var req ReqConjugate
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
// 			Message: "body parser error",
// 			Error:   err,
// 		})
// 	}
// 	c.Locals("req", req)
// 	return c.Next()
// }
