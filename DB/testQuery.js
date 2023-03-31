const { pool, dbConfig } = require("./db.js");

const mysql = require("mysql2/promise");

async function createDatabase() {
  try {
    const connection = await pool.getConnection();
    const createDbQuery = "CREATE DATABASE IF NOT EXISTS skatestore_db;";
    await connection.query(createDbQuery);
    connection.release();
    console.log("Database created successfully.");
  } catch (err) {
    console.error("Error creating database:", err);
  }
}

async function createTable(pool) {
  try {
    const connection = await pool.getConnection();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sample_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `;
    await connection.query(createTableQuery);
    connection.release();
    console.log("Table created.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

async function insertData(pool) {
  try {
    const connection = await pool.getConnection();
    const insertDataQuery = `
      INSERT INTO sample_table (name, email) VALUES
      ('John Doe', 'john.doe@example.com'),
      ('Jane Doe', 'jane.doe@example.com');
    `;
    await connection.query(insertDataQuery);
    connection.release();
    console.log("Sample data inserted.");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

async function testQuery(pool) {
  try {
    const connection = await pool.getConnection();
    const selectDataQuery = "SELECT * FROM sample_table;";
    const [rows, fields] = await connection.query(selectDataQuery);
    console.log("Data selected from the table:", rows);
    connection.release();
  } catch (err) {
    console.error("Error executing query:", err);
  }
}

(async () => {
  await createDatabase();

  // Update the pool configuration to use the new database
  dbConfig.database = "-";
  const newPool = mysql.createPool(dbConfig);

  await createTable(newPool);
  await insertData(newPool);
  await testQuery(newPool);
})();
