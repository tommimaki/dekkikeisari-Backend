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

console.log(
  process.env.AWS_HOST,
  process.env.AWS_USER,
  process.env.AWS_PASS,
  process.env.AWS_DB,
  process.env.DB_PORT
);

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

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
// TODO//: Add logs

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the MySQL server:", err.stack);
//     return;
//   }

//   console.log("Connected to the MySQL server as ID", connection.threadId);
// });

// module.exports = connection;
