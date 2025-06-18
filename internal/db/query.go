package db

func ExecuteQuery(connName string, query string) ([]map[string]interface{}, error) {
	db, err := GetConnection(connName)
	if err != nil {
		return nil, err
	}
	
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	cols, _ := rows.Columns()
	results := []map[string]interface{}{}
	
	for rows.Next() {
		vals := make([]interface{}, len(cols))
		valPtrs := make([]interface{}, len(cols))
		for i := range vals {
			valPtrs[i] = &vals[i]
		}
		
		rows.Scan(valPtrs...)
		
		rowMap := map[string]interface{}{}
		for i, col := range cols {
			rowMap[col] = vals[i]
		}
		results = append(results, rowMap)
	}
	return results, nil
}