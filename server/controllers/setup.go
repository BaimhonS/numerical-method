package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/gofiber/fiber/v2"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

func SetUpController(app *fiber.App, configClients configs.ConfigClients) {
	controller := app.Group("/numerical-method")
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	RootOfEquationController(controller, configClients)
	LinearAlgrebraController(controller, configClients)
}
