require("dotenv").config();

const mysql = require("mysql2/promise");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the MySQL server:", err.stack);
//     return;
//   }

//   console.log("Connected to the MySQL server as ID", connection.threadId);
// });

module.exports = connection;
