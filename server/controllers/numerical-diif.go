package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func NumericalDiffController(router fiber.Router, configClients configs.ConfigClients) {
	numericalDiffController := router.Group("/numerical-diff")
	numericalDiffService := services.NewNumericalDiffService(configClients.DB)
	numericalDiffValidate := validations.NewNumericalDiffValidate()

	numericalDiffController.Get("/:id", numericalDiffService.GetNumericalDiff)
	numericalDiffController.Post("/", numericalDiffValidate.ValidateNumericalDiff, numericalDiffService.CreateNumericalDiff)
}
