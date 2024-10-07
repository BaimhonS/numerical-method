package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/controllers"
	"github.com/BaimhonS/numerical-method/scripts"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("error loading .env file: %v", err)
	}
}

func main() {
	handleMigrations()

	configsClients := configs.SetupConfigs()

	app := fiber.New()

	app.Use(cors.New())

	controllers.SetUpController(app, configsClients)

	app.Listen(fmt.Sprintf(":%s", os.Getenv("SERVER_PORT")))
}

func handleMigrations() {
	for _, arg := range os.Args {
		if strings.Contains(arg, "migrate") {
			scripts.ScriptMigrate()
			os.Exit(0)
		}
	}
}
