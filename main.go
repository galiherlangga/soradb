package main

import (
	"context"
	"embed"
	"fmt"

	"github.com/galiherlangga/go-soradb/internal/db"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

type DBService struct {
	ctx context.Context
}

func NewDBService() *DBService {
	return &DBService{}
}

func (d *DBService) Startup(ctx context.Context) {
	d.ctx = ctx
}

func (d *DBService) Connect(name, driver, dsn string) error {
	return db.Connect(name, driver, dsn)
}

func (d *DBService) ExecuteQuery(connName string, query string) ([]map[string]interface{}, error) {
	return db.ExecuteQuery(connName, query)
}

//go:embed all:frontend/build
var assets embed.FS

func main() {
	dbService := NewDBService()

	err := wails.Run(&options.App{
		Title:  "Go SoraDB",
		Width:  1200,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        dbService.Startup,
		Bind: []interface{}{
			dbService,
		},
	})
	if err != nil {
		fmt.Println("Error starting application:", err)
		return
	}
}
