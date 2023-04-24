CREATE TABLE newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        address VARCHAR(255),
        role VARCHAR(255) NOT NULL DEFAULT 'user'
      );

       CREATE TABLE orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total DECIMAL(10, 2),
      status ENUM('Pending', 'Shipped', 'Delivered', 'Canceled'),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

        CREATE TABLE products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255),
      description TEXT,
      price DECIMAL(10, 2),
      category VARCHAR(255),
      image_urls json(255),
      sizes TEXT
    );