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

func GetDatabases(connName string) ([]string, error) {
	db, err := GetConnection(connName)
	if err != nil {
		return nil, err
	}

	rows, err := db.Query("SHOW DATABASES")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var databases []string
	for rows.Next() {
		var dbName string
		if err := rows.Scan(&dbName); err != nil {
			return nil, err
		}
		databases = append(databases, dbName)
	}

	return databases, nil
}

func GetTables(connName string, databaseName string) ([]map[string]interface{}, error) {
	db, err := GetConnection(connName)
	if err != nil {
		return nil, err
	}

	query := fmt.Sprintf("SELECT table_name FROM information_schema.tables WHERE table_schema = '%s'", databaseName)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []map[string]interface{}
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return nil, err
		}
		tables = append(tables, map[string]interface{}{"table_name": tableName})
	}

	return tables, nil
}