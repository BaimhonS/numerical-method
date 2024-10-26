package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/gofiber/fiber/v2"
)

// SetUpController initializes the API controllers
// @Summary Set up API controllers
// @Description Initializes the root of equations and linear algebra controllers
// @Tags Setup
// @Accept json
// @Produce json
// @Router /api [get]
func SetUpController(app *fiber.App, configClients configs.ConfigClients) {
	controller := app.Group("/numerical-method")

	RootOfEquationController(controller, configClients)
	LinearAlgrebraController(controller, configClients)
}
