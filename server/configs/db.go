package configs

import (
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	log.Println(os.Getenv("DSN"))
	db, err := gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{})

	if err != nil {
		log.Fatalf("error connecting to database : %v", err)
	}

	log.Println("database connected")

	return db
}
