const db = require("./db");

// run node initDB.js to initialise the database

const createUsersTable = async () => {
  const query = `
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip_code VARCHAR(10)
      );
    `;

  const connection = await db;
  await connection.query(query);
};

const createOrdersTable = async () => {
  const query = `
    CREATE TABLE orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total DECIMAL(10, 2),
      status ENUM('Pending', 'Shipped', 'Delivered', 'Canceled'),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  const connection = await db;
  await connection.query(query);
};

const createProductsTable = async () => {
  const query = `
    CREATE TABLE products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255),
      description TEXT,
      price DECIMAL(10, 2),
      category VARCHAR(255),
      image_url VARCHAR(255),
      sizes TEXT
    );
  `;

  const connection = await db;
  await connection.query(query);
};

const createOrderItemsTable = async () => {
  const query = `
    CREATE TABLE order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT,
      product_id INT,
      quantity INT,
      price DECIMAL(10, 2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  const connection = await db;
  await connection.query(query);
};

const createShoppingCartTable = async () => {
  const query = `
    CREATE TABLE shopping_cart (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      product_id INT,
      quantity INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  const connection = await db;
  await connection.query(query);
};

const initDB = async () => {
  try {
    const connection = await db;

    // console.log("Creating users table...");
    // await createUsersTable();
    // console.log("Users table created.");

    // console.log("Creating orders table...");
    // await createOrdersTable();
    // console.log("Orders table created.");

    console.log("Creating products table...");
    await createProductsTable();
    console.log("Products table created.");

    // console.log("Creating order items table...");
    // await createOrderItemsTable();
    // console.log("Order items table created.");

    // console.log("Creating shopping cart table...");
    // await createShoppingCartTable();
    // console.log("Shopping cart table created.");
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
};

initDB();
