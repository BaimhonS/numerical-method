package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/controllers"
	_ "github.com/BaimhonS/numerical-method/docs" // Ensure docs are generated
	"github.com/BaimhonS/numerical-method/scripts"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func init() {
	if os.Getenv("SERVER_PORT") != "8080" {
		if err := godotenv.Load(".env"); err != nil {
			log.Fatalf("error loading .env file: %v", err)
		}
	}
	if os.Getenv("SERVER_PORT") == "" {
		log.Fatalf("SERVER_PORT is not set in .env file")
	}

}

// @Title API Documentation
// @Version 0.2
// @Description API Documentation for User Service
func main() {
	handleMigrations()

	configsClients := configs.SetupConfigs()

	app := fiber.New()

	app.Use(cors.New(
		cors.Config{
			AllowOrigins: "*",
			AllowHeaders: "Origin, Content-Type, Accept, Authorization",
			AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
		},
	))

	controllers.SetUpController(app, configsClients)

	port := os.Getenv("SERVER_PORT")
	if err := app.Listen(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func handleMigrations() {
	for _, arg := range os.Args {
		if strings.Contains(arg, "migrate") {
			scripts.ScriptMigrate()
			os.Exit(0)
		}
	}
}
