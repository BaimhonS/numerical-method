package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func RootOfEquationController(router fiber.Router, configClients configs.ConfigClients) {
	rootController := router.Group("/root-of-equations")
	rootService := services.NewRootService(configClients.DB)
	rootValidate := validations.NewRootValidate()

	rootController.Post("/graphical", rootValidate.ValidateGraphical, rootService.CreateGraphical)
	rootController.Get("/graphical/:id", rootService.GetGraphical)
	rootController.Post("/bisection", rootValidate.ValidateBisection, rootService.CreateBisection)
	rootController.Get("/bisection/:id", rootService.GetBisection)
}
