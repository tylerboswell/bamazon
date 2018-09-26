CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NULL,
    product_name VARCHAR(45),
    department_name VARCHAR(45),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

use bamazon;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("item1", "departmen1", 100.00, 50),
    ("item2", "department2", 44.95, 100)