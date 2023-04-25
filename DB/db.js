// require("dotenv").config();

// const mysql = require("mysql2/promise");

// const dbConfig = {
//   host: process.env.AWS_HOST,
//   user: process.env.AWS_USER,
//   password: process.env.AWS_PASS,
//   database: process.env.AWS_DB,
//   port: process.env.DB_PORT,
//   charset: "utf8",
// };

// const pool = mysql.createPool(dbConfig);

// pool
//   .getConnection()
//   .then((connection) => {
//     console.log("Connected to the database!");
//     connection.release();
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database:", error);
//   });

// module.exports = {
//   pool,
//   dbConfig,
// };

require("dotenv").config();

const mysql = require("mysql2/promise");

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_PORT:", process.env.DB_PORT);

const isTestEnvironment = process.env.NODE_ENV === "test";
const dbConfig = isTestEnvironment
  ? {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3006,
    }
  : {
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
