package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

// RootOfEquationController sets up the root of equations routes
// @Summary Set up root of equations routes
// @Description Sets up routes for graphical, bisection, false position, one point, Newton Raphson, and secant methods
// @Tags Root of Equations
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Router /root-of-equations/{id} [get]
// @Router /root-of-equations/graphical [post]
// @Router /root-of-equations/graphical/{id} [get]
// @Router /root-of-equations/bisection [post]
// @Router /root-of-equations/bisection/{id} [get]
// @Router /root-of-equations/false-position [post]
// @Router /root-of-equations/false-position/{id} [get]
// @Router /root-of-equations/one-point [post]
// @Router /root-of-equations/one-point/{id} [get]
// @Router /root-of-equations/newton-raphson [post]
// @Router /root-of-equations/newton-raphson/{id} [get]
// @Router /root-of-equations/secant [post]
// @Router /root-of-equations/secant/{id} [get]

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
