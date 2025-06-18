package db

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql" // MySQL driver
)

var connection = map[string]*sql.DB{}

func Connect(name, driver, dsn string) error {
	db, err := sql.Open(driver, dsn)
	if err != nil {
		return err
	}
	if err := db.Ping(); err != nil {
		return err
	}
	connection[name] = db
	return nil
}

func GetConnection(name string) (*sql.DB, error) {
	db, ok := connection[name]
	if !ok {
		return nil, fmt.Errorf("no connection found for name: %s", name)
	}
	return db, nil
}