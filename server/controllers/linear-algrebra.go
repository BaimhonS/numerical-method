package controllers

import (
	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/services"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
)

func LinearAlgrebraController(router fiber.Router, configClients configs.ConfigClients) {
	linearController := router.Group("/linear-algrebra")
	linearService := services.NewLinearService(configClients.DB)
	linearValidate := validations.NewLinearValidate()

	linearController.Get("/matrix/:id", linearService.GetMatrix)
	linearController.Post("/matrix", linearValidate.ValidateMatrix, linearService.CreateMatrix)
	linearController.Get("/matrix-iteration/:id", linearService.GetMatrixIteration)
	linearController.Post("/matrix-iteration", linearValidate.ValidateMatrixIteration, linearService.CreateMatrixIteration)

}
