package src

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	DatabaseURL string `json:"database_url"`
	APIKey      string `json:"api_key"`
}

func ReadConfigFile(filePath string) (Config, error) {
	var config Config

	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return config, err
	}

	if err := json.Unmarshal(data, &config); err != nil {
		return config, err
	}

	return config, nil
}
