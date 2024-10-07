package configs

import "gorm.io/gorm"

type ConfigClients struct {
	DB *gorm.DB
}

func SetupConfigs() ConfigClients {
	return ConfigClients{
		DB: ConnectDB(),
	}
}
