var mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config();
var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin123',
  database: process.env.DB_DATABASE || 'minerals'
});




module.exports = connection;
