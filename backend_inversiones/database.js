var mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config();
var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  keepAlive: true
});

module.exports = connection;
