package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func LeastSquaresRegressionController(router fiber.Router, configClients configs.ConfigClients) {
	leastSquaresRegressionController := router.Group("/least-squares-regression")
	leastSquaresRegressionValidate := validations.NewLeastSquaresRegressionValidate()
	leastSquaresRegressionService := services.NewLeastSquaresRegressionService(configClients.DB)

	leastSquaresRegressionController.Get("/linear-regression/:id", leastSquaresRegressionService.GetLinearRegression)
	leastSquaresRegressionController.Post("/linear-regression", leastSquaresRegressionValidate.ValidateLinearRegression, leastSquaresRegressionService.CreateLinearRegression)
	leastSquaresRegressionController.Get("/polynomial-regression/:id", leastSquaresRegressionService.GetPolynomialRegression)
	leastSquaresRegressionController.Post("/polynomial-regression", leastSquaresRegressionValidate.ValidatePolynomialRegression, leastSquaresRegressionService.CreatePolynomialRegression)
	leastSquaresRegressionController.Get("/multiple-regression/:id", leastSquaresRegressionService.GetMultipleRegression)
	leastSquaresRegressionController.Post("/multiple-regression", leastSquaresRegressionValidate.ValidateMultipleRegression, leastSquaresRegressionService.CreateMultipleRegression)
}
