const { Client } = require("pg");
const mysql = require("mysql2");
const { DB_URI } = require("./config");

var db = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "potentiate",
	database: "ghnk",
});

db.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

// let db = new Client({
// 	connectionString: DB_URI,
// });

// db.connect();

module.exports = db;
