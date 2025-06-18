# SoraDB - Modern Database Client

A native GUI database client built with Wails, Svelte, and Bun. SoraDB provides a modern, intuitive interface for managing and exploring your databases.

## Features

- **Multi-Database Support**: MySQL, PostgreSQL, SQLite
- **Multiple Connections**: Connect to multiple databases simultaneously
- **Tab System**: Open multiple tables in tabs for easy comparison
- **Modern UI**: Dark theme with neon green accents
- **Real-time Data**: View and browse table data with pagination
- **Connection Management**: Save and manage database connections
- **Table Explorer**: Browse databases, tables, and views
- **Data Grid**: Advanced table data viewer with sorting and filtering

## Tech Stack

- **Backend**: Go with Wails v2 framework
- **Frontend**: Svelte with SvelteKit
- **Build Tool**: Bun for fast package management
- **Styling**: Tailwind CSS
- **Database**: Native database drivers for each supported database

## Prerequisites

Before you begin, ensure you have the following installed:

- [Go](https://golang.org/doc/install) (version 1.18 or later)
- [Bun](https://bun.sh/) (latest version)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation) (v2.10.1 or later)

### Installing Wails CLI

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/soraDB.git
   cd soraDB
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   bun install
   cd ..
   ```

3. **Install Go dependencies**
   ```bash
   go mod tidy
   ```

## Development

### Running in Development Mode

```bash
wails dev
```

This will start the development server with hot reload enabled.

### Building the Frontend

```bash
cd frontend
bun run build
cd ..
```

### Building for Production

```bash
wails build
```

The built application will be available in the `build` directory.

## Project Structure

```
soraDB/
├── frontend/                  # Svelte frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/    # Svelte components
│   │   │   ├── stores/        # State management
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── utils/         # Utility functions
│   │   │   └── backends/      # API services
│   │   └── routes/            # SvelteKit routes
│   ├── package.json
│   └── ...
├── internal/                  # Go backend logic
│   └── db/                    # Database operations
├── main.go                    # Main Go application
├── go.mod
├── wails.json                 # Wails configuration
└── README.md
```

## Usage

### Connecting to a Database

1. Launch SoraDB
2. Click "Add Connection" (+ button) in the sidebar
3. Fill in your database connection details:
   - **Database Type**: MySQL, PostgreSQL, or SQLite
   - **Host**: Database server hostname
   - **Port**: Database server port
   - **Username**: Database username
   - **Password**: Database password
   - **Database Name**: (Optional) Specific database to connect to

### Exploring Data

1. After connecting, select a database from the left panel
2. Browse tables in the main panel
3. Click "View" on any table to open it in a new tab
4. Use the pagination controls to navigate through data
5. Switch between tabs to compare different tables

### Managing Connections

- **Multiple Connections**: Connect to multiple databases simultaneously
- **Remove Connections**: Hover over a connection and click the X button
- **Switch Connections**: Click on any connection icon to switch

## Configuration

### Database Drivers

SoraDB uses native database drivers:
- **MySQL**: `github.com/go-sql-driver/mysql`
- **PostgreSQL**: `github.com/lib/pq`
- **SQLite**: `github.com/mattn/go-sqlite3`

### Customization

You can customize the application by modifying:
- **Theme**: Update CSS variables in `frontend/src/app.css`
- **UI Components**: Modify components in `frontend/src/lib/components/`
- **Database Logic**: Update Go code in `internal/db/`

## Development Commands

```bash
# Start development server
wails dev

# Build frontend only
cd frontend && bun run build

# Run TypeScript checks
cd frontend && bun run check

# Format frontend code
cd frontend && bun run format

# Build production binary
wails build

# Clean build artifacts
wails build -clean
```

## Supported Databases

### MySQL
- MySQL 5.7+
- MariaDB 10.3+

### PostgreSQL
- PostgreSQL 10+

### SQLite
- SQLite 3.6+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **"index.html: file does not exist"**
   - Run `cd frontend && bun run build` to build the frontend first

2. **Go module issues**
   - Run `go mod tidy` to clean up dependencies

3. **Wails bindings not updating**
   - Delete `frontend/wailsjs` directory and run `wails dev`

4. **Port already in use**
   - The dev server uses port 34115 by default. Ensure it's not in use.

### Database Connection Issues

1. **MySQL connection failed**
   - Ensure MySQL server is running
   - Check hostname, port, username, and password
   - Verify user has proper permissions

2. **PostgreSQL connection failed**
   - Ensure PostgreSQL server is running
   - Check connection parameters
   - Verify `pg_hba.conf` allows connections

3. **SQLite file not found**
   - Ensure the SQLite file path is correct
   - Check file permissions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Wails](https://wails.io/) for the fantastic Go + Web framework
- [Svelte](https://svelte.dev/) for the reactive UI framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Bun](https://bun.sh/) for the fast package manager and bundler

## Support

If you encounter any issues or have questions, please:
1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [issues](https://github.com/your-username/soraDB/issues)
3. Create a new issue with detailed information

---

Made with ❤️ using Wails, Svelte, and Go