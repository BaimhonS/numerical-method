package scripts

import (
	"log"

	"github.com/BaimhonS/numerical-method/configs"
	"github.com/BaimhonS/numerical-method/models"
)

func ScriptMigrate() {
	db := configs.ConnectDB()

	if err := db.AutoMigrate(
		&models.Bisection{},
		&models.Graphical{},
		&models.FalsePosition{},
		&models.NewtonRaphson{},
		&models.OnePoint{},
		&models.Secant{},
		&models.Matrix{},
		&models.MatrixIteration{},
		&models.LinearRegression{},
		&models.PolynomialRegression{},
		&models.MultipleRegression{},
		&models.LinearNewton{},
		&models.QuadraticNewton{},
		&models.PolynomialNewton{},
		&models.QuadraticLagrange{},
		&models.NumericalDiff{},
		&models.Trapezoid{},
		&models.Simpson{},
		&models.QuadraticSpline{},
	); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("Migration successful")
}
