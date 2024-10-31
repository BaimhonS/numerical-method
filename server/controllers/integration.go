package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func IntegrationController(router fiber.Router, configClients configs.ConfigClients) {
	integrationController := router.Group("/integration")
	integrationService := services.NewIntegrationService(configClients.DB)
	integrationValidate := validations.NewIntegrationValidate()

	integrationController.Get("/trapezoid/:id", integrationService.GetTrapezoid)
	integrationController.Post("/trapezoid", integrationValidate.ValidateTrapezoid, integrationService.CreateTrapezoid)
	integrationController.Get("/simpson/:id", integrationService.GetSimpson)
	integrationController.Post("/simpson", integrationValidate.ValidateSimpson, integrationService.CreateSimpson)
}
