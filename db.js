const { Client } = require("pg");
const mysql = require("mysql2");
const { DB_URI } = require("./config");

var db = mysql.createConnection({
	host: process.env.DATABASE_HOST || "localhost",
	port: 8889,
	user: process.env.DATABASE_USERNAME || "root",
	password: process.env.DATABASE_PASSWORD || "potentiate",
	database: process.env.DATABASE_NAME || "ghnk",
});

console.log("process.env.DATABASE_HOST = ", process.env.DATABASE_HOST);
console.log("process.env.DATABASE_USERNAME = ", process.env.DATABASE_USERNAME);
console.log("process.env.DATABASE_PASSWORD = ", process.env.DATABASE_PASSWORD);
console.log("process.env.DATABASE_NAME = ", process.env.DATABASE_NAME);
console.log("db = ", db)

var connect = () => {
	db.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
	})
}

// let db = new Client({
// 	connectionString: DB_URI,
// });

// db.connect();

module.exports = { db, connect };
