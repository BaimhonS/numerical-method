package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

// LinearAlgrebraController sets up the linear algebra routes
// @Summary Set up linear algebra routes
// @Description Sets up routes for Cramer Rule, Gauss Elimination, Gauss Jordan, LU Decomposition, Matrix Inverse, Cholesky Decomposition, Jacobi Iteration, Gauss Seidel, and Conjugate Gradient
// @Tags Linear Algebra
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Router /linear-algrebra/{id} [get]
// @Router /linear-algrebra/cramer-rule [post]
// @Router /linear-algrebra/gauss-eliminate/{id} [get]
// @Router /linear-algrebra/gauss-eliminate [post]
// @Router /linear-algrebra/gauss-jordan/{id} [get]
// @Router /linear-algrebra/gauss-jordan [post]
// @Router /linear-algrebra/lu-decomposition/{id} [get]
// @Router /linear-algrebra/lu-decomposition [post]
// @Router /linear-algrebra/matrix-inverse/{id} [get]
// @Router /linear-algrebra/matrix-inverse [post]
// @Router /linear-algrebra/cholesky-decomposition/{id} [get]
// @Router /linear-algrebra/cholesky-decomposition [post]
// @Router /linear-algrebra/jacobi-iteration/{id} [get]
// @Router /linear-algrebra/jacobi-iteration [post]
// @Router /linear-algrebra/gauss-seidel/{id} [get]
// @Router /linear-algrebra/gauss-seidel [post]
// @Router /linear-algrebra/conjugate-gradient/{id} [get]
// @Router /linear-algrebra/conjugate-gradient [post]

func LinearAlgrebraController(router fiber.Router, configClients configs.ConfigClients) {
	linearController := router.Group("/linear-algrebra")
	linearService := services.NewLinearService(configClients.DB)
	linearValidate := validations.NewLinearValidate()

	linearController.Get("/cramer-rule/:id", linearService.GetCramerRule)
	linearController.Post("/cramer-rule", linearValidate.ValidateCramerRule, linearService.CreateCramerRule)
	linearController.Get("/gauss-eliminate/:id", linearService.GetGaussEliminate)
	linearController.Post("/gauss-eliminate", linearValidate.ValidateGaussEliminate, linearService.CreateGaussEliminate)
	linearController.Get("/gauss-jordan/:id", linearService.GetGaussJordan)
	linearController.Post("/gauss-jordan", linearValidate.ValidateGaussJordan, linearService.CreateGaussJordan)
	linearController.Get("/lu-decomposition/:id", linearService.GetLUDecomposition)
	linearController.Post("/lu-decomposition", linearValidate.ValidateLUDecomposition, linearService.CreateLUDecomposition)
	linearController.Get("/matrix-inverse/:id", linearService.GetMatrixInverse)
	linearController.Post("/matrix-inverse", linearValidate.ValidateMatrixInverse, linearService.CreateMatrixInverse)
	linearController.Get("/cholesky-decomposition/:id", linearService.GetCholeskyDecomposition)
	linearController.Post("/cholesky-decomposition", linearValidate.ValidateCholeskyDecomposition, linearService.CreateCholeskyDecomposition)
	linearController.Get("/jacobi-iteration/:id", linearService.GetJacobiIteration)
	linearController.Post("/jacobi-iteration", linearValidate.ValidateJacobiIteration, linearService.CreateJacobiIteration)
	linearController.Get("/gauss-seidel/:id", linearService.GetGaussSeidelIteration)
	linearController.Post("/gauss-seidel", linearValidate.ValidateGaussSaidelIteration, linearService.CreateGaussSaidelIteration)
	linearController.Get("/conjugate-gradient/:id", linearService.GetConjugateGradient)
	linearController.Post("/conjugate-gradient", linearValidate.ValidateConjugate, linearService.CreateConjugateGradient)

}
