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
	rootController.Post("/false-position", rootValidate.ValidateFalsePosition, rootService.CreateFalsePosition)
	rootController.Get("/false-position/:id", rootService.GetFalsePosition)
	rootController.Post("/one-point", rootValidate.ValidateOnePoint, rootService.CreateOnePoint)
	rootController.Get("/one-point/:id", rootService.GetOnePoint)
	rootController.Post("/newton-raphson", rootValidate.ValidateNewtonRaphson, rootService.CreateNewtonRaphson)
	rootController.Get("/newton-raphson/:id", rootService.GetNewtonRaphson)
	rootController.Post("/secant", rootValidate.ValidateSecant, rootService.CreateSecant)
	rootController.Get("/secant/:id", rootService.GetSecant)
}
