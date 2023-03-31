require("dotenv").config();

const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASS,
  database: process.env.AWS_DB,
  port: process.env.DB_PORT,
};

const pool = mysql.createPool(dbConfig);

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to the database!");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = {
  pool,
  dbConfig,
};
