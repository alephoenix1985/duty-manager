const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// --- Database Configuration ---
// We read from environment variables, with defaults for local development.
const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT) || 5433,
};

const DB_NAME = process.env.DB_NAME || "duties";

const main = async () => {
  console.log("--- Starting Database Setup ---");

  // Connect to the default 'postgres' database to create our new database
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("[1/3] Connected to PostgreSQL server.");

    // Check if the database already exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`,
    );
    if (res.rowCount === 0) {
      console.log(`[2/3] Database '${DB_NAME}' not found. Creating it...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`      > Database '${DB_NAME}' created successfully.`);
    } else {
      console.log(
        `[2/3] Database '${DB_NAME}' already exists. Skipping creation.`,
      );
    }
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }

  // Now, connect to the newly created 'duties' database to run the init script
  const appDbClient = new Client({ ...dbConfig, database: DB_NAME });
  try {
    await appDbClient.connect();
    console.log(
      `[3/3] Connected to '${DB_NAME}' database. Running init script...`,
    );

    const sqlScript = fs.readFileSync(
      path.join(__dirname, "./init.sql"),
      "utf8",
    );
    await appDbClient.query(sqlScript);
    console.log("      > Tables created and sample data inserted.");
  } catch (error) {
    console.error("Error running init script:", error);
    process.exit(1);
  } finally {
    await appDbClient.end();
  }

  console.log("--- Database Setup Complete! ---");
};

main();
