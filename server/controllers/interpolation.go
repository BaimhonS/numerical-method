package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func InterpolationController(router fiber.Router, configClients configs.ConfigClients) {
	interpolationController := router.Group("/interpolation")
	interpolationService := services.NewInterpolationService(configClients.DB)
	interpolationValidate := validations.NewInterpolationValidate()

	interpolationController.Get("/linear-newton/:id", interpolationService.GetLinearNewton)
	interpolationController.Post("/linear-newton", interpolationValidate.ValidateLinearNewton, interpolationService.CreateLinearNewton)
	interpolationController.Get("/quadratic-newton/:id", interpolationService.GetQuadraticNewton)
	interpolationController.Post("/quadratic-newton", interpolationValidate.ValidateQuadraticNewton, interpolationService.CreateQuadraticNewton)
	interpolationController.Get("/polynomial-newton/:id", interpolationService.GetPolynomialNewton)
	interpolationController.Post("/polynomial-newton", interpolationValidate.ValidatePolynomialNewton, interpolationService.CreatePolynomialNewton)
	interpolationController.Get("/quadratic-lagrange/:id", interpolationService.GetQuadraticLagrange)
	interpolationController.Post("/quadratic-lagrange", interpolationValidate.ValidateQuadraticLagrange, interpolationService.CreateQuadraticLagrange)
}
