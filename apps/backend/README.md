# Backend Application

This is the backend application for the Duty Manager project.

## Configuration

### Port Configuration

By default, the backend API runs on port `3001`. You can change this port by setting the `PORT` environment variable before starting the application:

```bash
PORT=4001 npm start
```

### Database Configuration

The database connection parameters are configured via environment variables. The following variables are used:

*   `DB_USER`: PostgreSQL username (default: `postgres`)
*   `DB_HOST`: Database host (default: `localhost`)
*   `DB_NAME`: Database name (default: `duties`)
*   `DB_PASSWORD`: Database password (default: `postgres`)
*   `DB_PORT`: Database port (default: `5433`)

You can set these environment variables to connect to your desired PostgreSQL instance.

## Available Scripts

In the project directory, you can run:

### `npm start`

Starts the backend server in production mode.

### `npm run dev`

Starts the backend server in development mode with hot-reloading.

### `npm test`

Runs the test suite for the backend application.

### `npm run build`

Builds the TypeScript source code into JavaScript in the `dist` folder.
