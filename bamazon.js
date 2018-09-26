const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
connection.connect(error => {
    if(error){
        console.error(`error connecting: ${error}`)
    }
    console.log('connected');
    loadProducts();
});
function loadProducts(){
    connection.query(`SELECT * FROM products`, (err, res)=>{
        if (err){ 
            throw err;
        };
        console.table(res);
        promptCustomerForItem(res);
    });
};
const promptCustomerForItem = inventory => {
    inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(val => {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory); 
      console.log(product);
      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptCustomerForQuantity(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nWe're out of that.");
        loadProducts();
      }
    });
}
const checkInventory = (choiceId, inventory) =>{
    const item = inventory.filter(item => item.item_id === choiceId);
    return item.length > 0 ? item[0] : null;
}
const promptCustomerForQuantity = product => {
    inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: val => val >0 || val.toLowerCase() ==="q"
      }
    ])
    .then(val => {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.quantity);
      var quantity = parseInt(val.quantity);
      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nWe don't have that many.");
        loadProducts();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
};
const checkIfShouldExit = choice =>{
    if(choice.toLowerCase() === 'q'){
        console.log(`Thanks for shopping!`);
        process.exit(0);
    }
}
const makePurchase = (product, quantity) => {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function(err, res) {
          // Let the user know the purchase was successful, re-run loadProducts
          console.log("\nYou purchased " + quantity + " " + product.product_name + "'s!");
          loadProducts();
        }
      );     
}