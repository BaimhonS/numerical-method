package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/gofiber/fiber/v2"
)

func SetUpController(app *fiber.App, configClients configs.ConfigClients) {
	controller := app.Group("/api")

	RootOfEquationController(controller, configClients)
}
