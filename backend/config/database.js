import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Successfully connected to database");
    done();
  }
});

export default pool;
